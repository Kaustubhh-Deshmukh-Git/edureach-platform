import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../src/utils/password.util.ts";

describe("Password Utility", () => {
  const plainPassword = "SuperSecurePassword123!";

  it("hashes password such that hash != plain", async () => {
    const hash = await hashPassword(plainPassword);
    expect(hash).not.toBe(plainPassword);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(20);
  });

  it("returns true when comparing plain password with its hash", async () => {
    const hash = await hashPassword(plainPassword);
    const isMatch = await comparePassword(plainPassword, hash);
    expect(isMatch).toBe(true);
  });

  it("returns false when comparing incorrect password with hash", async () => {
    const hash = await hashPassword(plainPassword);
    const isMatch = await comparePassword("WrongPassword123!", hash);
    expect(isMatch).toBe(false);
  });

  it("produces unique hashes for the same password across runs", async () => {
    const hash1 = await hashPassword(plainPassword);
    const hash2 = await hashPassword(plainPassword);
    expect(hash1).not.toBe(hash2);
    expect(await comparePassword(plainPassword, hash1)).toBe(true);
    expect(await comparePassword(plainPassword, hash2)).toBe(true);
  });
});
