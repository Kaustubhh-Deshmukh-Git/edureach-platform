import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../src/models/user.model.ts";

describe("User Model", () => {
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

  it("creates a user successfully with valid data", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword123",
      phone: "9876543210",
    };

    const user = await User.create(userData);
    expect(user.id).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@example.com");
    expect(user.phone).toBe("9876543210");
    expect(user.created_at).toBeInstanceOf(Date);
  });

  it("rejects duplicate email addresses", async () => {
    await User.create({
      name: "First User",
      email: "duplicate@example.com",
      password: "password123",
    });

    let error: (Error & { code?: number }) | null = null;
    try {
      await User.create({
        name: "Second User",
        email: "duplicate@example.com",
        password: "password456",
      });
    } catch (err) {
      error = err as Error & { code?: number };
    }

    expect(error).not.toBeNull();
    expect(error?.code).toBe(11000);
  });

  it("automatically lowercases email addresses", async () => {
    const user = await User.create({
      name: "Case Test",
      email: "Jane.Doe@EXAMPLE.com",
      password: "password123",
    });

    expect(user.email).toBe("jane.doe@example.com");

    const found = await User.findOne({ email: "jane.doe@example.com" });
    expect(found).not.toBeNull();
  });

  it("excludes password and __v from toJSON() while exposing id", async () => {
    const user = await User.create({
      name: "JSON Test",
      email: "json@example.com",
      password: "supersecretpassword",
    });

    const json = user.toJSON() as Record<string, unknown>;

    expect(json["id"]).toBeDefined();
    expect(json["_id"]).toBeUndefined();
    expect(json["__v"]).toBeUndefined();
    expect(json["password"]).toBeUndefined();
    expect(json["name"]).toBe("JSON Test");
    expect(json["email"]).toBe("json@example.com");
  });

  it("enforces validation on required fields and name length", async () => {
    let error: mongoose.Error.ValidationError | null = null;
    try {
      await User.create({
        name: "A", // too short, minlength is 2
        email: "short@example.com",
        password: "password123",
      });
    } catch (err) {
      error = err as mongoose.Error.ValidationError;
    }

    expect(error).not.toBeNull();
    expect(error?.errors["name"]).toBeDefined();
  });
});
