import type { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.ts";
import { hashPassword, comparePassword } from "../utils/password.util.ts";
import { generateToken } from "../utils/jwt.util.ts";
import { AppError } from "../utils/app-error.util.ts";
import type { RegisterInput, LoginInput } from "../validators/auth.validator.ts";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, phone } = req.body as RegisterInput;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered.", 409);
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      ...(phone && phone.trim().length > 0 ? { phone: phone.trim() } : {}),
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const userData = user.toJSON() as unknown as Record<string, unknown>;
    delete userData["password"];

    res.status(201).json({
      success: true,
      data: {
        token,
        user: userData,
      },
    });
  } catch (error: unknown) {
    if (error !== null && typeof error === "object" && "code" in error && error.code === 11000) {
      next(new AppError("Email already registered.", 409));
      return;
    }
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      throw new AppError("Invalid email or password.", 401);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password.", 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const userData = user.toJSON() as unknown as Record<string, unknown>;
    delete userData["password"];

    res.status(200).json({
      success: true,
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized.", 401);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const userData = user.toJSON() as unknown as Record<string, unknown>;
    delete userData["password"];

    res.status(200).json({
      success: true,
      data: {
        user: userData,
      },
    });
  } catch (error) {
    next(error);
  }
}
