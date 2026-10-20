import { describe, it, expect } from "vitest";
import { parseEnv } from "../src/config/env.config.ts";

describe("env.config", () => {
  it("passes validation with valid environment variables", () => {
    const validEnv = {
      NODE_ENV: "test" as const,
      PORT: "5000",
      MONGODB_URI: "mongodb://127.0.0.1:27017/edureach_test",
      JWT_SECRET: "at_least_thirty_two_characters_long_secret_key",
      JWT_EXPIRES_IN: "7d",
      CLIENT_URL: "http://localhost:5173",
    };

    const parsed = parseEnv(validEnv);
    expect(parsed.PORT).toBe(5000);
    expect(parsed.NODE_ENV).toBe("test");
    expect(parsed.JWT_SECRET).toBe("at_least_thirty_two_characters_long_secret_key");
  });

  it("fails validation when JWT_SECRET is less than 32 characters", () => {
    const invalidEnv = {
      NODE_ENV: "test" as const,
      PORT: "5000",
      MONGODB_URI: "mongodb://127.0.0.1:27017/edureach_test",
      JWT_SECRET: "too_short_secret",
      JWT_EXPIRES_IN: "7d",
      CLIENT_URL: "http://localhost:5173",
    };

    expect(() => parseEnv(invalidEnv)).toThrow("Invalid environment configuration");
  });
});
