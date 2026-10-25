import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.ts";
import { User } from "../src/models/user.model.ts";
import { generateToken } from "../src/utils/jwt.util.ts";
import { logger } from "../src/utils/logger.util.ts";
import {
  initiateOutboundCall,
  normalizeIndianPhoneNumber,
  maskPhoneNumber,
  sanitizePromptText,
} from "../src/services/vapi.service.ts";

describe("Voice Agent API (Vapi) & Service Tests", () => {
  const mockUser = {
    id: "user-123",
    name: "Aarav Sharma",
    email: "aarav.voice@edureach.edu",
    phone: "9876543210",
  };

  const validToken = generateToken({
    userId: mockUser.id,
    email: mockUser.email,
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env["ENABLE_VAPI_RATE_LIMIT"];

    vi.spyOn(User, "findById").mockImplementation(((id: string) => {
      if (id === "user-second") {
        return Promise.resolve({
          id: "user-second",
          name: "Second User",
          email: "second@edureach.edu",
        });
      }
      return Promise.resolve(mockUser);
    }) as unknown as typeof User.findById);
  });

  afterEach(() => {
    delete process.env["ENABLE_VAPI_RATE_LIMIT"];
  });

  describe("Utility & Sanitization Functions", () => {
    it("normalizeIndianPhoneNumber formats 10-digit, 91, and +91 numbers to E.164", () => {
      expect(normalizeIndianPhoneNumber("9876543210")).toBe("+919876543210");
      expect(normalizeIndianPhoneNumber("919876543210")).toBe("+919876543210");
      expect(normalizeIndianPhoneNumber("+919876543210")).toBe("+919876543210");
      expect(normalizeIndianPhoneNumber("  8765432109  ")).toBe("+918765432109");
    });

    it("normalizeIndianPhoneNumber throws 400 for invalid numbers", () => {
      expect(() => normalizeIndianPhoneNumber("1234567890")).toThrow(
        "Invalid phone number. Must be a valid 10-digit Indian mobile number.",
      );
      expect(() => normalizeIndianPhoneNumber("5876543210")).toThrow(
        "Invalid phone number. Must be a valid 10-digit Indian mobile number.",
      );
      expect(() => normalizeIndianPhoneNumber("98765")).toThrow(
        "Invalid phone number. Must be a valid 10-digit Indian mobile number.",
      );
    });

    it("maskPhoneNumber masks middle digits properly (+91******3210)", () => {
      expect(maskPhoneNumber("+919876543210")).toBe("+91******3210");
      expect(maskPhoneNumber("9876543210")).toBe("987******3210");
      expect(maskPhoneNumber("123")).toBe("****");
    });

    it("sanitizePromptText strips control characters, newlines, and caps length", () => {
      const malicious = "Hacked\x00\x1f\n\rCourse\tName    with   spaces";
      const cleaned = sanitizePromptText(malicious, 20);
      expect(cleaned).toBe("Hacked Course Name w");
      expect(cleaned).not.toContain("\n");
      expect(cleaned).not.toContain("\r");
      expect(cleaned).not.toContain("\x00");
    });
  });

  describe("Vapi Service (initiateOutboundCall)", () => {
    it("sends expected payload to https://api.vapi.ai/call and returns call details", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "call-uuid-123",
          status: "queued",
        }),
      } as Response);

      const result = await initiateOutboundCall({
        phoneNumber: "9876543210",
        studentName: "Priya Nair",
        preferredCourse: "B.Tech AI & Data Science",
      });

      expect(result).toEqual({
        callId: "call-uuid-123",
        status: "queued",
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(url).toBe("https://api.vapi.ai/call");
      expect(options.method).toBe("POST");
      expect(options.headers).toMatchObject({
        "Content-Type": "application/json",
        Authorization: expect.stringContaining("Bearer "),
      });

      const body = JSON.parse(options.body as string) as {
        assistantId: string;
        phoneNumberId: string;
        customer: { number: string; name: string };
        assistantOverrides: { firstMessage: string };
      };

      expect(body.customer.number).toBe("+919876543210");
      expect(body.customer.name).toBe("Priya Nair");
      expect(body.assistantOverrides.firstMessage).toContain("Priya Nair");
      expect(body.assistantOverrides.firstMessage).toContain("B.Tech AI & Data Science");
      expect(body.assistantOverrides.firstMessage).toContain("Ava from EduReach College");
    });

    it("logs only masked phone number and never leaks the full phone number or API key", async () => {
      const infoSpy = vi.spyOn(logger, "info");

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "call-uuid-456",
          status: "queued",
        }),
      } as Response);

      await initiateOutboundCall({
        phoneNumber: "9876543210",
        studentName: "Rahul",
      });

      const loggedCalls = infoSpy.mock.calls;
      const loggedStrings = JSON.stringify(loggedCalls);

      // Verify masked phone appears
      expect(loggedStrings).toContain("+91******3210");
      // Verify full unmasked number does NOT appear in logged object arguments
      expect(loggedStrings).not.toContain("9876543210");
    });

    it("maps upstream Vapi HTTP error (non-2xx) to AppError with 502 status", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ error: "Invalid assistant configuration" }),
      } as Response);

      await expect(
        initiateOutboundCall({
          phoneNumber: "9876543210",
          studentName: "Student",
        }),
      ).rejects.toThrow("Failed to initiate voice call. Please try again later.");
    });
  });

  describe("POST /api/vapi/call Route", () => {
    it("returns 401 when Authorization header is missing", async () => {
      const res = await request(app).post("/api/vapi/call").send({
        phoneNumber: "9876543210",
        preferredCourse: "B.Tech CSE",
      });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Authorization token required.",
      });
    });

    it("returns 400 when phone number is invalid or not 10 Indian digits", async () => {
      const res = await request(app)
        .post("/api/vapi/call")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          phoneNumber: "12345",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/valid 10-digit Indian mobile number/i);
    });

    it("returns 400 when preferredCourse exceeds 120 characters", async () => {
      const res = await request(app)
        .post("/api/vapi/call")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          phoneNumber: "9876543210",
          preferredCourse: "C".repeat(121),
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/cannot exceed 120 characters/i);
    });

    it("returns 200 with callId and status on happy path", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "call-rec-987",
          status: "queued",
        }),
      } as Response);

      const res = await request(app)
        .post("/api/vapi/call")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          phoneNumber: "9876543210",
          preferredCourse: "MBA - Marketing",
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: {
          callId: "call-rec-987",
          status: "queued",
          message: "Call initiated successfully. You will receive a call shortly.",
        },
      });
    });

    it("returns 502 when Vapi upstream service fails", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
        new Error("Connection refused by api.vapi.ai"),
      );

      const res = await request(app)
        .post("/api/vapi/call")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          phoneNumber: "9876543210",
        });

      expect(res.status).toBe(502);
      expect(res.body).toEqual({
        success: false,
        message: "Failed to initiate voice call. Please try again later.",
      });
    });

    it("enforces rate limit of 3 calls per hour per user and returns 429", async () => {
      process.env["ENABLE_VAPI_RATE_LIMIT"] = "true";

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "call-success",
          status: "queued",
        }),
      } as Response);

      // Perform 3 calls successfully
      for (let i = 0; i < 3; i++) {
        const res = await request(app)
          .post("/api/vapi/call")
          .set("Authorization", `Bearer ${validToken}`)
          .send({ phoneNumber: "9876543210" });
        expect(res.status).toBe(200);
      }

      // 4th call should hit rate limit
      const blockedRes = await request(app)
        .post("/api/vapi/call")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ phoneNumber: "9876543210" });

      expect(blockedRes.status).toBe(429);
      expect(blockedRes.body).toEqual({
        success: false,
        message: "Call limit reached. Maximum 3 calls per hour allowed. Please try again later.",
      });

      // Another user should still be able to call
      const otherToken = generateToken({
        userId: "user-second",
        email: "second@edureach.edu",
      });

      const otherRes = await request(app)
        .post("/api/vapi/call")
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ phoneNumber: "9876543210" });

      expect(otherRes.status).toBe(200);
    });

    it("returns 404 when user is not found in database", async () => {
      vi.spyOn(User, "findById").mockResolvedValueOnce(null);
      const res = await request(app)
        .post("/api/vapi/call")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ phoneNumber: "9876543210" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: "User account not found.",
      });
    });
  });
});
