import pino from "pino";
import { env } from "../config/env.config.ts";

export const logger = pino({
  level: env.NODE_ENV === "test" ? "silent" : "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "password",
      "token",
      "*.password",
      "*.token",
      "req.body.password",
    ],
    censor: "[REDACTED]",
  },
});
