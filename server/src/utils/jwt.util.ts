import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.config.ts";

export interface JWTPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: JWTPayload, expiresIn?: string | number): string {
  const expiry = (expiresIn ?? env.JWT_EXPIRES_IN) as NonNullable<SignOptions["expiresIn"]>;
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: expiry,
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
  });
  return decoded as JWTPayload;
}
