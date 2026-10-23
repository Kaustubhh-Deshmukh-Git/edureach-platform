import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { MongoClient } from "mongodb";
import type { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import {
  extractTextFromContent,
  initializeKnowledgeBase,
  getRAGResponse,
  retrieveTool,
  SYSTEM_PROMPT,
  setMongoClientForTesting,
  setVectorStoreForTesting,
  closeRagConnections,
} from "../src/services/rag.service.ts";
import { AppError } from "../src/utils/app-error.util.ts";

describe("RAG Service Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    setMongoClientForTesting(null);
    setVectorStoreForTesting(null);
    await closeRagConnections();
  });

  describe("extractTextFromContent", () => {
    it("extracts text from plain string content", () => {
      expect(extractTextFromContent("Hello world")).toBe("Hello world");
    });

    it("extracts text from array of content blocks with text field", () => {
      const parts = [
        { type: "text", text: "Part one." },
        { type: "text", text: "Part two." },
      ];
      expect(extractTextFromContent(parts)).toBe("Part one.\nPart two.");
    });

    it("extracts text from array of strings", () => {
      const parts = ["Line 1", "Line 2"];
      expect(extractTextFromContent(parts)).toBe("Line 1\nLine 2");
    });

    it("handles single object with text property", () => {
      expect(extractTextFromContent({ text: "Single block" })).toBe("Single block");
    });

    it("returns empty string for null, undefined, or empty arrays", () => {
      expect(extractTextFromContent(null)).toBe("");
      expect(extractTextFromContent(undefined)).toBe("");
      expect(extractTextFromContent([])).toBe("");
    });
  });

  describe("SYSTEM_PROMPT", () => {
    it("contains all critical constraints per prompt specification", () => {
      expect(SYSTEM_PROMPT).toContain("EduReach’s admissions assistant");
      expect(SYSTEM_PROMPT).toContain("retrieve");
      expect(SYSTEM_PROMPT).toContain("+91 9876543210");
      expect(SYSTEM_PROMPT).toContain("₹");
    });
  });

  describe("initializeKnowledgeBase with change detection", () => {
    const tempDir = path.resolve(__dirname, "../../scratch");
    const tempKbFile = path.join(tempDir, "test-kb.txt");

    beforeEach(() => {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      fs.writeFileSync(tempKbFile, "ABOUT US\nThis is temporary test campus content.");
    });

    afterEach(() => {
      if (fs.existsSync(tempKbFile)) {
        fs.unlinkSync(tempKbFile);
      }
    });

    it("skips indexing when hash matches and docs already exist", async () => {
      const mockMetaCollection = {
        findOne: vi.fn().mockResolvedValue({
          _id: "edureach-knowledge",
          hash: "match-hash",
          chunkCount: 15,
        }),
        updateOne: vi.fn(),
      };
      const mockDocsCollection = {
        countDocuments: vi.fn().mockResolvedValue(15),
        deleteMany: vi.fn(),
      };

      // Compute actual hash of temp file
      const crypto = await import("node:crypto");
      const expectedHash = crypto
        .createHash("sha256")
        .update(fs.readFileSync(tempKbFile))
        .digest("hex");
      mockMetaCollection.findOne.mockResolvedValue({
        _id: "edureach-knowledge",
        hash: expectedHash,
        chunkCount: 15,
      });

      const mockDb = {
        collection: vi.fn((name: string) => {
          if (name === "knowledge_meta") return mockMetaCollection;
          if (name === "knowledge_docs") return mockDocsCollection;
          return {};
        }),
      };
      const mockClient = {
        db: vi.fn().mockReturnValue(mockDb),
        close: vi.fn(),
      };

      setMongoClientForTesting(mockClient as unknown as MongoClient);

      const result = await initializeKnowledgeBase(tempKbFile);
      expect(result.indexed).toBe(false);
      expect(result.chunkCount).toBe(15);
      expect(mockDocsCollection.deleteMany).not.toHaveBeenCalled();
    });

    it("triggers re-indexing when hash changes or collection is empty", async () => {
      const mockMetaCollection = {
        findOne: vi.fn().mockResolvedValue({
          _id: "edureach-knowledge",
          hash: "old-stale-hash",
          chunkCount: 5,
        }),
        updateOne: vi.fn().mockResolvedValue({ acknowledged: true }),
      };
      const mockDocsCollection = {
        countDocuments: vi.fn().mockResolvedValue(0),
        deleteMany: vi.fn().mockResolvedValue({ acknowledged: true }),
      };

      const mockDb = {
        collection: vi.fn((name: string) => {
          if (name === "knowledge_meta") return mockMetaCollection;
          if (name === "knowledge_docs") return mockDocsCollection;
          return {};
        }),
      };
      const mockClient = {
        db: vi.fn().mockReturnValue(mockDb),
        close: vi.fn(),
      };
      const mockVectorStore = {
        addDocuments: vi.fn().mockResolvedValue(["id-1"]),
      };

      setMongoClientForTesting(mockClient as unknown as MongoClient);
      setVectorStoreForTesting(mockVectorStore as unknown as MongoDBAtlasVectorSearch);

      const result = await initializeKnowledgeBase(tempKbFile);
      expect(result.indexed).toBe(true);
      expect(result.chunkCount).toBeGreaterThan(0);
      expect(mockDocsCollection.deleteMany).toHaveBeenCalled();
      expect(mockVectorStore.addDocuments).toHaveBeenCalled();
      expect(mockMetaCollection.updateOne).toHaveBeenCalled();
    });
  });

  describe("retrieveTool", () => {
    it("formats retrieved document chunks into Source and Content blocks", async () => {
      const mockVectorStore = {
        similaritySearch: vi.fn().mockResolvedValue([
          {
            pageContent: "B.Tech tuition fee is ₹1,50,000 per year.",
            metadata: { source: "FEES" },
          },
          {
            pageContent: "Day scholar total fee is ₹1,70,000 per year.",
            metadata: { source: "FEES" },
          },
        ]),
      };

      setVectorStoreForTesting(mockVectorStore as unknown as MongoDBAtlasVectorSearch);

      const result = await retrieveTool.invoke({ query: "B.Tech fee" });
      expect(result).toContain("Source: FEES");
      expect(result).toContain("Content: B.Tech tuition fee is ₹1,50,000 per year.");
      expect(result).toContain("Day scholar total fee is ₹1,70,000 per year.");
    });

    it("returns fallback message when no documents match", async () => {
      const mockVectorStore = {
        similaritySearch: vi.fn().mockResolvedValue([]),
      };

      setVectorStoreForTesting(mockVectorStore as unknown as MongoDBAtlasVectorSearch);

      const result = await retrieveTool.invoke({ query: "Random unknown query" });
      expect(result).toBe("No relevant campus information found in the knowledge base.");
    });
  });

  describe("getRAGResponse error handling", () => {
    it("maps unexpected agent failures to AppError with 502 status code", async () => {
      // Intentionally pass empty or broken key to induce error
      vi.stubEnv("GOOGLE_API_KEY", "invalid_key");

      await expect(getRAGResponse("What is the fee?")).rejects.toThrow(AppError);
      try {
        await getRAGResponse("What is the fee?");
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).statusCode).toBe(502);
        expect((err as AppError).message).toBe(
          "The assistant is temporarily unavailable. Please try again.",
        );
      }
      vi.unstubAllEnvs();
    });
  });
});
