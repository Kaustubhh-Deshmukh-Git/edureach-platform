import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.ts";
import { generateToken } from "../src/utils/jwt.util.ts";
import * as ragService from "../src/services/rag.service.ts";
import { AppError } from "../src/utils/app-error.util.ts";

vi.mock("../src/services/rag.service.ts", () => ({
  getRAGResponse: vi.fn(),
  initializeKnowledgeBase: vi.fn().mockResolvedValue({
    indexed: false,
    chunkCount: 20,
    hash: "test-hash",
  }),
  closeRagConnections: vi.fn().mockResolvedValue(undefined),
}));

describe("Chat API — POST /api/chat/message", () => {
  const validToken = generateToken({
    userId: "user-123",
    email: "student@edureach.edu",
  });

  const secondUserToken = generateToken({
    userId: "user-456",
    email: "student2@edureach.edu",
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env["ENABLE_CHAT_RATE_LIMIT"];
  });

  describe("Authentication", () => {
    it("returns 401 when Authorization header is missing", async () => {
      const res = await request(app)
        .post("/api/chat/message")
        .send({ message: "What are the B.Tech CSE fees?" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Authorization token required.",
      });
      expect(ragService.getRAGResponse).not.toHaveBeenCalled();
    });

    it("returns 401 when Authorization header is not a Bearer token", async () => {
      const res = await request(app)
        .post("/api/chat/message")
        .set("Authorization", "Basic 123456")
        .send({ message: "What are the B.Tech CSE fees?" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Authorization token required.",
      });
    });

    it("returns 401 when Bearer token is invalid or malformed", async () => {
      const res = await request(app)
        .post("/api/chat/message")
        .set("Authorization", "Bearer invalid.jwt.token")
        .send({ message: "What are the B.Tech CSE fees?" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        success: false,
        message: "Invalid or malformed token.",
      });
    });
  });

  describe("Validation", () => {
    it("returns 400 when message field is omitted", async () => {
      const res = await request(app)
        .post("/api/chat/message")
        .set("Authorization", `Bearer ${validToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/message is required/i);
      expect(ragService.getRAGResponse).not.toHaveBeenCalled();
    });

    it("returns 400 when message is empty or whitespace only", async () => {
      const res = await request(app)
        .post("/api/chat/message")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ message: "    " });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/message cannot be empty/i);
      expect(ragService.getRAGResponse).not.toHaveBeenCalled();
    });

    it("returns 400 when message exceeds 1000 characters", async () => {
      const longMessage = "a".repeat(1001);
      const res = await request(app)
        .post("/api/chat/message")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ message: longMessage });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/cannot exceed 1000 characters/i);
      expect(ragService.getRAGResponse).not.toHaveBeenCalled();
    });
  });

  describe("Success & Response Mapping", () => {
    it("returns 200 with data.response shape on success", async () => {
      const mockReply =
        "The annual tuition fee for B.Tech in CSE at EduReach College is ₹1,50,000 per year.";
      vi.mocked(ragService.getRAGResponse).mockResolvedValueOnce(mockReply);

      const res = await request(app)
        .post("/api/chat/message")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ message: "  What is the B.Tech CSE fee?  " });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: {
          response: mockReply,
        },
      });
      // Verifies message was trimmed before passing to getRAGResponse
      expect(ragService.getRAGResponse).toHaveBeenCalledWith("What is the B.Tech CSE fee?");
    });

    it("maps unexpected RAG service error to 502 with friendly message", async () => {
      vi.mocked(ragService.getRAGResponse).mockRejectedValueOnce(
        new Error("Gemini upstream API failure"),
      );

      const res = await request(app)
        .post("/api/chat/message")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ message: "Tell me about hostels" });

      expect(res.status).toBe(502);
      expect(res.body).toEqual({
        success: false,
        message: "The assistant is temporarily unavailable. Please try again.",
      });
    });

    it("maps AppError(502) from RAG service cleanly to 502 response", async () => {
      vi.mocked(ragService.getRAGResponse).mockRejectedValueOnce(
        new AppError("The assistant is temporarily unavailable. Please try again.", 502),
      );

      const res = await request(app)
        .post("/api/chat/message")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ message: "Tell me about scholarships" });

      expect(res.status).toBe(502);
      expect(res.body).toEqual({
        success: false,
        message: "The assistant is temporarily unavailable. Please try again.",
      });
    });
  });

  describe("Rate Limiting", () => {
    it("blocks request with 429 when per-user rate limit is exceeded", async () => {
      process.env["ENABLE_CHAT_RATE_LIMIT"] = "true";
      vi.mocked(ragService.getRAGResponse).mockResolvedValue("Sample answer");

      // Rate limit is 20 requests per minute
      const requests = Array.from({ length: 20 }, () =>
        request(app)
          .post("/api/chat/message")
          .set("Authorization", `Bearer ${validToken}`)
          .send({ message: "Rate limit test message" }),
      );

      const responses = await Promise.all(requests);
      for (const res of responses) {
        expect(res.status).toBe(200);
      }

      // 21st request should be rate-limited
      const rateLimitedRes = await request(app)
        .post("/api/chat/message")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ message: "Exceeding message" });

      expect(rateLimitedRes.status).toBe(429);
      expect(rateLimitedRes.body).toEqual({
        success: false,
        message: "Too many chat requests. Please try again after a minute.",
      });

      // A different user should NOT be rate limited
      const otherUserRes = await request(app)
        .post("/api/chat/message")
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ message: "Hello from second user" });

      expect(otherUserRes.status).toBe(200);
    });
  });
});
