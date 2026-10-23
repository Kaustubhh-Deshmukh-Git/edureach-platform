import { Router } from "express";
import rateLimit from "express-rate-limit";
import { sendMessage } from "../controllers/chat.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { validate } from "../validators/auth.validator.ts";
import { chatSchema } from "../validators/chat.validator.ts";
import { env } from "../config/env.config.ts";

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.userId ?? req.ip ?? "anonymous",
  skip: () => {
    if (process.env["ENABLE_CHAT_RATE_LIMIT"] === "true") {
      return false;
    }
    return (process.env["NODE_ENV"] ?? env.NODE_ENV) === "test";
  },
  message: {
    success: false,
    message: "Too many chat requests. Please try again after a minute.",
  },
});

export const chatRoutes = Router();

chatRoutes.post("/message", authMiddleware, chatLimiter, validate(chatSchema), sendMessage);
