import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../src/app.ts";
import { User } from "../src/models/user.model.ts";
import { generateToken } from "../src/utils/jwt.util.ts";

describe("Auth API Integration", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      binary: { version: "7.0.14" },
    });
    await mongoose.connect(mongoServer.getUri());
    await User.init();
  }, 300000);

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe("POST /api/auth/register", () => {
    it("registers a new user successfully and returns 201 with token and sanitized user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "student@edureach.edu",
        password: "Password123!",
        phone: "9876543210",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(typeof res.body.data.token).toBe("string");
      expect(res.body.data.user.id).toBeDefined();
      expect(res.body.data.user.name).toBe("Test User");
      expect(res.body.data.user.email).toBe("student@edureach.edu");
      expect(res.body.data.user.phone).toBe("9876543210");
      expect(res.body.data.user.password).toBeUndefined();
    });

    it("registers a user without optional phone number", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User 2",
        email: "student2@edureach.edu",
        password: "Password123!",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe("student2@edureach.edu");
    });

    it("returns 409 when registering with an already existing email", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Existing User",
        email: "duplicate@edureach.edu",
        password: "Password123!",
      });

      const duplicateRes = await request(app).post("/api/auth/register").send({
        name: "Another User",
        email: "duplicate@edureach.edu",
        password: "DifferentPassword123!",
      });

      expect(duplicateRes.status).toBe(409);
      expect(duplicateRes.body.success).toBe(false);
      expect(duplicateRes.body.message).toMatch(/already registered/i);
    });

    it("returns 400 when name is less than 2 characters", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "A",
        email: "valid@edureach.edu",
        password: "Password123!",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/at least 2 characters/i);
    });

    it("returns 400 when email is invalid", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Valid Name",
        email: "not-an-email",
        password: "Password123!",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email/i);
    });

    it("returns 400 when password is less than 8 characters", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Valid Name",
        email: "valid@edureach.edu",
        password: "short",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/at least 8 characters/i);
    });

    it("returns 400 when phone number is not 10 digits", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Valid Name",
        email: "valid@edureach.edu",
        password: "Password123!",
        phone: "12345",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/10 digits/i);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        name: "Login User",
        email: "login@edureach.edu",
        password: "ValidPassword123!",
      });
    });

    it("logs in successfully with valid credentials and returns 200 with token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@edureach.edu",
        password: "ValidPassword123!",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe("login@edureach.edu");
      expect(res.body.data.user.password).toBeUndefined();
    });

    it("returns 401 with generic message for non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@edureach.edu",
        password: "ValidPassword123!",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid email or password.");
    });

    it("returns 401 with generic message for incorrect password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@edureach.edu",
        password: "WrongPassword999!",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid email or password.");
    });

    it("returns 400 when email or password is missing", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@edureach.edu",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    let validToken: string;
    let userId: string;

    beforeEach(async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Profile User",
        email: "profile@edureach.edu",
        password: "ValidPassword123!",
        phone: "9123456780",
      });

      validToken = res.body.data.token;
      userId = res.body.data.user.id;
    });

    it("returns 200 and user profile when valid token is provided", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe(userId);
      expect(res.body.data.user.name).toBe("Profile User");
      expect(res.body.data.user.email).toBe("profile@edureach.edu");
      expect(res.body.data.user.phone).toBe("9123456780");
      expect(res.body.data.user.password).toBeUndefined();
    });

    it("returns 401 when Authorization header is missing", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/token required/i);
    });

    it("returns 401 when Authorization header is not Bearer", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Basic ${validToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/token required/i);
    });

    it("returns 401 when token is invalid or malformed", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid.malformed.token");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid or malformed/i);
    });

    it("returns 401 with distinct message when token is expired", async () => {
      const expiredToken = generateToken({ userId, email: "profile@edureach.edu" }, "-1s");

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/token expired/i);
    });

    it("returns 404 when user referenced in token does not exist", async () => {
      const ghostId = new mongoose.Types.ObjectId().toString();
      const ghostToken = generateToken({
        userId: ghostId,
        email: "ghost@edureach.edu",
      });

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${ghostToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/user not found/i);
    });
  });
});
