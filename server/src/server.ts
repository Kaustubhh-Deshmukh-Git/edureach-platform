import type { Server } from "node:http";
import { app } from "./app.ts";
import { env } from "./config/env.config.ts";
import { connectDB, disconnectDB } from "./config/database.config.ts";
import { closeRagConnections } from "./services/rag.service.ts";
import { logger } from "./utils/logger.util.ts";

let server: Server | null = null;

async function bootstrap(): Promise<void> {
  try {
    await connectDB();

    server = app.listen(env.PORT, () => {
      logger.info(
        `Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode on Node ${process.version}`,
      );
    });
  } catch (error) {
    logger.error(error, "Failed to start server");
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}, initiating graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info("HTTP server closed.");
      try {
        await closeRagConnections();
        await disconnectDB();
        logger.info("Database connection closed. Exiting process.");
        process.exit(0);
      } catch (err) {
        logger.error(err, "Error during database disconnection");
        process.exit(1);
      }
    });
  } else {
    try {
      await closeRagConnections();
      await disconnectDB();
      process.exit(0);
    } catch {
      process.exit(1);
    }
  }
}

process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => void gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason: unknown) => {
  logger.error({ err: reason }, "Unhandled Rejection");
  process.exit(1);
});

void bootstrap();
