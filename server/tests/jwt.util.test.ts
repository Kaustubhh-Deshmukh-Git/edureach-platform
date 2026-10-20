import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../src/utils/jwt.util.ts";
import type { JWTPayload } from "../src/utils/jwt.util.ts";

describe("JWT Utility", () => {
  const mockPayload: JWTPayload = {
    userId: "64b8f1a2e3d4c5b6a7f8e9d0",
    email: "student@edureach.edu",
  };

  it("successfully roundtrips token generation and verification", () => {
    const token = generateToken(mockPayload);
    expect(typeof token).toBe("string");

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(mockPayload.userId);
    expect(decoded.email).toBe(mockPayload.email);
  });

  it("throws TokenExpiredError when token is expired", () => {
    const expiredToken = generateToken(mockPayload, "-1s");

    expect(() => verifyToken(expiredToken)).toThrow(jwt.TokenExpiredError);
  });

  it("throws JsonWebTokenError when token is tampered", () => {
    const validToken = generateToken(mockPayload);
    const parts = validToken.split(".");
    expect(parts.length).toBe(3);

    // Tamper with the payload part
    const tamperedPayload = Buffer.from(
      JSON.stringify({ userId: "hacked", email: "evil@edureach.edu" }),
    ).toString("base64url");
    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    expect(() => verifyToken(tamperedToken)).toThrow(jwt.JsonWebTokenError);
  });

  it("throws JsonWebTokenError when signature is completely invalid", () => {
    const invalidToken = "header.payload.invalidsignature";
    expect(() => verifyToken(invalidToken)).toThrow(jwt.JsonWebTokenError);
  });
});
