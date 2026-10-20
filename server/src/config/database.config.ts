import mongoose from "mongoose";
import { env } from "./env.config.ts";

export async function connectDB(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    const host = conn.connection.host;
    const name = conn.connection.name;
    console.log(`MongoDB connected: ${host}/${name}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    throw error;
  }
}
