import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { ZodSchema } from "zod";
import { AppError } from "../utils/app-error.util.ts";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(80, "Name cannot exceed 80 characters."),
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .email("Invalid email address.")
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters long.")
    .max(72, "Password cannot exceed 72 characters."),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits.")
    .optional()
    .or(z.literal("")),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .email("Invalid email address.")
    .toLowerCase(),
  password: z.string({ required_error: "Password is required." }).min(1, "Password is required."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export function validate(schema: ZodSchema) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const result = await schema.safeParseAsync(req.body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const message = firstIssue?.message ?? "Validation failed.";
      next(new AppError(message, 400));
      return;
    }
    req.body = result.data;
    next();
  };
}
