import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.util.ts";
import { logger } from "../utils/logger.util.ts";
import { env } from "../config/env.config.ts";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  const status = "status" in err && typeof err.status === "number" ? err.status : 500;
  const isProduction = (process.env["NODE_ENV"] ?? env.NODE_ENV) === "production";
  const message =
    status === 500
      ? isProduction
        ? "Internal server error."
        : err.message || "Internal server error."
      : err.message;

  res.status(status).json({
    success: false,
    message,
  });
}
