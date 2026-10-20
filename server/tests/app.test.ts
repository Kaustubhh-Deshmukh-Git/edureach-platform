import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.ts";
import { AppError } from "../src/utils/app-error.util.ts";
import { errorHandler } from "../src/middleware/error-handler.middleware.ts";
import type { Request, Response, NextFunction } from "express";

describe("Express App Foundation", () => {
  it("GET /api/health returns 200 and health status", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: {
        status: "ok",
        uptime: expect.any(Number),
      },
    });
  });

  it("returns 404 JSON for unknown routes", async () => {
    const res = await request(app).get("/api/unknown-endpoint");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Route not found: GET /api/unknown-endpoint",
    });
  });

  it("rejects request bodies larger than 10kb limit", async () => {
    // Generate body exceeding 10kb
    const largeData = "x".repeat(1024 * 11);
    const res = await request(app)
      .post("/api/health")
      .set("Content-Type", "application/json")
      .send({ data: largeData });

    expect(res.status).toBe(413);
    expect(res.body.success).toBe(false);
  });

  it("handles AppError with its status code and message", () => {
    const err = new AppError("Invalid credentials provided", 401);
    let capturedStatus = 0;
    let capturedBody: unknown = null;

    const mockRes = {
      status(s: number) {
        capturedStatus = s;
        return this;
      },
      json(data: unknown) {
        capturedBody = data;
        return this;
      },
    } as unknown as Response;

    errorHandler(err, {} as Request, mockRes, (() => {}) as NextFunction);

    expect(capturedStatus).toBe(401);
    expect(capturedBody).toEqual({
      success: false,
      message: "Invalid credentials provided",
    });
  });

  it("hides error details and returns generic message in production for unknown 500 errors", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    try {
      const err = new Error("Database password leaked in stack trace");
      let capturedStatus = 0;
      let capturedBody: unknown = null;

      const mockRes = {
        status(s: number) {
          capturedStatus = s;
          return this;
        },
        json(data: unknown) {
          capturedBody = data;
          return this;
        },
      } as unknown as Response;

      errorHandler(err, {} as Request, mockRes, (() => {}) as NextFunction);

      expect(capturedStatus).toBe(500);
      expect(capturedBody).toEqual({
        success: false,
        message: "Internal server error.",
      });
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });
});
