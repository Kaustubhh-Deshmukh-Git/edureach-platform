import mongoose from "mongoose";
import { env } from "./env.config.ts";
import { logger } from "../utils/logger.util.ts";

export async function connectDB(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    const host = conn.connection.host;
    const name = conn.connection.name;
    logger.info(`MongoDB connected: ${host}/${name}`);
    return conn;
  } catch (error) {
    logger.error(error, "MongoDB connection error");
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully");
  } catch (error) {
    logger.error(error, "MongoDB disconnection error");
    throw error;
  }
}
