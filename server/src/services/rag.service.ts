import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { env } from "../config/env.config.ts";
import { logger } from "../utils/logger.util.ts";

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
