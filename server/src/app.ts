import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.config.ts";
import { logger } from "./utils/logger.util.ts";
import { errorHandler } from "./middleware/error-handler.middleware.ts";
import { notFound } from "./middleware/notFound.middleware.ts";

export const app = express();

if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));

if (env.NODE_ENV !== "test") {
  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
    }),
  );
}

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      uptime: process.uptime(),
    },
  });
});

app.use(notFound);
app.use(errorHandler);
