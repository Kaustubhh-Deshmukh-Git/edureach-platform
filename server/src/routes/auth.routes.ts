import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, getMe } from "../controllers/auth.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { validate, registerSchema, loginSchema } from "../validators/auth.validator.ts";
import { env } from "../config/env.config.ts";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => (process.env["NODE_ENV"] ?? env.NODE_ENV) === "test",
  message: {
    success: false,
    message: "Too many authentication requests, please try again after 15 minutes.",
  },
});

export const authRoutes = Router();

authRoutes.post("/register", authLimiter, validate(registerSchema), register);
authRoutes.post("/login", authLimiter, validate(loginSchema), login);
authRoutes.get("/me", authMiddleware, getMe);
