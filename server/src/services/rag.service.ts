import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MongoClient, type Collection } from "mongodb";
import { env } from "../config/env.config.ts";
import { logger } from "../utils/logger.util.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const KNOWLEDGE_FILE_PATH = path.resolve(
  __dirname,
  "../../knowledge-base/edureach-knowledge.txt",
);

let mongoClient: MongoClient | null = null;
let embeddingsInstance: GoogleGenerativeAIEmbeddings | null = null;
let vectorStoreInstance: MongoDBAtlasVectorSearch | null = null;

export function getMongoClient(): MongoClient {
  if (!mongoClient) {
    mongoClient = new MongoClient(env.MONGODB_URI);
  }
  return mongoClient;
}

export function setMongoClientForTesting(client: MongoClient | null): void {
  mongoClient = client;
}

export async function closeRagConnections(): Promise<void> {
  if (mongoClient) {
    try {
      await mongoClient.close();
      logger.info("Closed RAG MongoDB client connection.");
    } catch (err) {
      logger.error({ err }, "Error closing RAG MongoDB client");
    } finally {
      mongoClient = null;
      vectorStoreInstance = null;
    }
  }
}

export function getEmbeddings(): GoogleGenerativeAIEmbeddings {
  if (!embeddingsInstance) {
    embeddingsInstance = new GoogleGenerativeAIEmbeddings({
      apiKey: env.GOOGLE_API_KEY,
      model: "gemini-embedding-001",
    });
  }
  return embeddingsInstance;
}

export function setEmbeddingsForTesting(embeddings: GoogleGenerativeAIEmbeddings | null): void {
  embeddingsInstance = embeddings;
}

export function getVectorStore(): MongoDBAtlasVectorSearch {
  if (!vectorStoreInstance) {
    const client = getMongoClient();
    const collection = client.db("edureach_db").collection("knowledge_docs");
    vectorStoreInstance = new MongoDBAtlasVectorSearch(getEmbeddings(), {
      collection: collection as unknown as ConstructorParameters<
        typeof MongoDBAtlasVectorSearch
      >[1]["collection"],
      indexName: "edureach_vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    });
  }
  return vectorStoreInstance;
}

export function setVectorStoreForTesting(store: MongoDBAtlasVectorSearch | null): void {
  vectorStoreInstance = store;
}

export interface KnowledgeMetaDoc {
  _id: string;
  hash: string;
  chunkCount: number;
  indexedAt: Date;
}

export interface KnowledgeBaseInitResult {
  indexed: boolean;
  chunkCount: number;
  hash: string;
}

export async function initializeKnowledgeBase(
  customFilePath?: string,
): Promise<KnowledgeBaseInitResult> {
  const filePath = customFilePath ?? KNOWLEDGE_FILE_PATH;

  if (!fs.existsSync(filePath)) {
    throw new Error(`Knowledge base file not found at: ${filePath}`);
  }

  const fileBuffer = await fs.promises.readFile(filePath);
  const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

  const client = getMongoClient();
  const db = client.db("edureach_db");
  const metaCollection: Collection<KnowledgeMetaDoc> = db.collection("knowledge_meta");
  const docsCollection: Collection = db.collection("knowledge_docs");

  const meta = await metaCollection.findOne({ _id: "edureach-knowledge" });
  const docsCount = await docsCollection.countDocuments();

  if (meta && meta["hash"] === fileHash && docsCount > 0) {
    logger.info(`already indexed (${docsCount} chunks)`);
    return {
      indexed: false,
      chunkCount: docsCount,
      hash: fileHash,
    };
  }

  logger.info("Indexing knowledge base into MongoDB Atlas Vector Search...");
  await docsCollection.deleteMany({});

  const loader = new TextLoader(filePath);
  const rawDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(rawDocs);

  const vectorStore = getVectorStore();
  const batchSize = 50;
  for (let i = 0; i < splitDocs.length; i += batchSize) {
    const batch = splitDocs.slice(i, i + batchSize);
    await vectorStore.addDocuments(batch);
  }

  await metaCollection.updateOne(
    { _id: "edureach-knowledge" },
    {
      $set: {
        hash: fileHash,
        chunkCount: splitDocs.length,
        indexedAt: new Date(),
      },
    },
    { upsert: true },
  );

  logger.info(`Stored ${splitDocs.length} chunks`);
  return {
    indexed: true,
    chunkCount: splitDocs.length,
    hash: fileHash,
  };
}
