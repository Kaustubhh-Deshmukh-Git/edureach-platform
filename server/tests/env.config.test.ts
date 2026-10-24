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
      GOOGLE_API_KEY: "valid_gemini_api_key",
      VAPI_API_KEY: "valid_vapi_key",
      VAPI_ASSISTANT_ID: "valid_assistant_id",
      VAPI_PHONE_NUMBER_ID: "valid_phone_number_id",
    };

    const parsed = parseEnv(validEnv);
    expect(parsed.PORT).toBe(5000);
    expect(parsed.NODE_ENV).toBe("test");
    expect(parsed.JWT_SECRET).toBe("at_least_thirty_two_characters_long_secret_key");
    expect(parsed.GOOGLE_API_KEY).toBe("valid_gemini_api_key");
    expect(parsed.VAPI_API_KEY).toBe("valid_vapi_key");
    expect(parsed.VAPI_ASSISTANT_ID).toBe("valid_assistant_id");
    expect(parsed.VAPI_PHONE_NUMBER_ID).toBe("valid_phone_number_id");
  });

  it("fails validation when JWT_SECRET is less than 32 characters", () => {
    const invalidEnv = {
      NODE_ENV: "test" as const,
      PORT: "5000",
      MONGODB_URI: "mongodb://127.0.0.1:27017/edureach_test",
      JWT_SECRET: "too_short_secret",
      JWT_EXPIRES_IN: "7d",
      CLIENT_URL: "http://localhost:5173",
      GOOGLE_API_KEY: "valid_gemini_api_key",
      VAPI_API_KEY: "valid_vapi_key",
      VAPI_ASSISTANT_ID: "valid_assistant_id",
      VAPI_PHONE_NUMBER_ID: "valid_phone_number_id",
    };

    expect(() => parseEnv(invalidEnv)).toThrow("Invalid environment configuration");
  });

  it("fails validation when GOOGLE_API_KEY is missing or empty", () => {
    const invalidEnv = {
      NODE_ENV: "test" as const,
      PORT: "5000",
      MONGODB_URI: "mongodb://127.0.0.1:27017/edureach_test",
      JWT_SECRET: "at_least_thirty_two_characters_long_secret_key",
      JWT_EXPIRES_IN: "7d",
      CLIENT_URL: "http://localhost:5173",
      GOOGLE_API_KEY: "",
      VAPI_API_KEY: "valid_vapi_key",
      VAPI_ASSISTANT_ID: "valid_assistant_id",
      VAPI_PHONE_NUMBER_ID: "valid_phone_number_id",
    };

    expect(() => parseEnv(invalidEnv)).toThrow("Invalid environment configuration");
  });

  it("fails validation when VAPI_API_KEY is missing or empty", () => {
    const invalidEnv = {
      NODE_ENV: "test" as const,
      PORT: "5000",
      MONGODB_URI: "mongodb://127.0.0.1:27017/edureach_test",
      JWT_SECRET: "at_least_thirty_two_characters_long_secret_key",
      JWT_EXPIRES_IN: "7d",
      CLIENT_URL: "http://localhost:5173",
      GOOGLE_API_KEY: "valid_gemini_api_key",
      VAPI_API_KEY: "",
      VAPI_ASSISTANT_ID: "valid_assistant_id",
      VAPI_PHONE_NUMBER_ID: "valid_phone_number_id",
    };

    expect(() => parseEnv(invalidEnv)).toThrow("Invalid environment configuration");
  });
});
