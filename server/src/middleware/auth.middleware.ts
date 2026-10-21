import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt.util.ts";
import type { JWTPayload } from "../utils/jwt.util.ts";
import { AppError } from "../utils/app-error.util.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authorization token required.", 401));
  }

  const token = authHeader.split(" ")[1]?.trim();
  if (!token) {
    return next(new AppError("Authorization token required.", 401));
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError || (error as Error).name === "TokenExpiredError") {
      return next(new AppError("Token expired. Please log in again.", 401));
    }
    return next(new AppError("Invalid or malformed token.", 401));
  }
}

export const authenticate = authMiddleware;
