import { Router } from "express";
import rateLimit from "express-rate-limit";
import { startCall } from "../controllers/vapi.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { validate } from "../validators/auth.validator.ts";
import { vapiCallSchema } from "../validators/vapi.validator.ts";
import { env } from "../config/env.config.ts";

// Note: In a multi-instance production deployment, replace this in-memory store with a shared
// distributed store like Redis (e.g., rate-limit-redis) to enforce the 3 calls/hour limit across all replicas.
export const vapiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  limit: 3, // 3 calls per hour per authenticated student
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.userId ?? "anonymous",
  validate: { keyGeneratorIpFallback: false },
  skip: () => {
    if (process.env["ENABLE_VAPI_RATE_LIMIT"] === "true") {
      return false;
    }
    return (process.env["NODE_ENV"] ?? env.NODE_ENV) === "test";
  },
  message: {
    success: false,
    message: "Call limit reached. Maximum 3 calls per hour allowed. Please try again later.",
  },
});

export const vapiRoutes = Router();

vapiRoutes.post("/call", authMiddleware, vapiLimiter, validate(vapiCallSchema), startCall);
