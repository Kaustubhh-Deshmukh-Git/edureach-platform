import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { KnowledgeDoc } from "../src/models/knowledge-doc.model.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Knowledge Base Document & Model", () => {
  const kbPath = path.resolve(__dirname, "../knowledge-base/edureach-knowledge.txt");

  it("edureach-knowledge.txt exists and is non-empty", () => {
    expect(fs.existsSync(kbPath)).toBe(true);
    const content = fs.readFileSync(kbPath, "utf-8");
    expect(content.trim().length).toBeGreaterThan(500);
  });

  it("contains all required ALL-CAPS section headers", () => {
    const content = fs.readFileSync(kbPath, "utf-8");
    const requiredSections = [
      "ABOUT US",
      "COURSES OFFERED",
      "FEES",
      "ADMISSIONS",
      "PLACEMENTS",
      "CAMPUS & FACILITIES",
      "HOSTEL & MESS",
      "FACULTY",
      "MENTORS",
      "EVENTS & CLUBS",
      "CONTACT",
      "FAQ",
    ];

    for (const section of requiredSections) {
      expect(content).toContain(section);
      // Ensure header is on its own line
      const regex = new RegExp(`^${section}$`, "m");
      expect(regex.test(content)).toBe(true);
    }
  });

  it("contains canonical facts aligned with client content and Appendix A", () => {
    const content = fs.readFileSync(kbPath, "utf-8");

    // Fees
    expect(content).toContain("₹1,50,000");
    expect(content).toContain("₹1,70,000");
    expect(content).toContain("₹2,50,000");
    expect(content).toContain("₹1,00,000");
    expect(content).toContain("₹2,00,000");

    // Admissions & Placements
    expect(content).toContain("March 1");
    expect(content).toContain("92%");
    expect(content).toContain("42.0 LPA");
    expect(content).toContain("Google");
    expect(content).toContain("10.2 LPA");

    // Campus & Contact
    expect(content).toContain("25-acre");
    expect(content).toContain("Knowledge City, Gachibowli, Hyderabad");
    expect(content).toContain("+91 9876543210");
  });

  describe("KnowledgeDoc Mongoose Model", () => {
    it("creates a valid in-memory document with required schema fields", () => {
      const doc = new KnowledgeDoc({
        text: "Sample campus knowledge snippet",
        embedding: new Array(3072).fill(0.01),
        metadata: { source: "edureach-knowledge.txt", section: "ABOUT US" },
      });

      const validationError = doc.validateSync();
      expect(validationError).toBeUndefined();
      expect(doc.text).toBe("Sample campus knowledge snippet");
      expect(doc.embedding.length).toBe(3072);
      expect(doc.metadata["section"]).toBe("ABOUT US");
    });

    it("fails validation when text or embedding is missing", () => {
      const invalidDoc = new KnowledgeDoc({
        metadata: { source: "test" },
      });

      const validationError = invalidDoc.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError?.errors["text"]).toBeDefined();
      expect(validationError?.errors["embedding"]).toBeDefined();
    });
  });
});
