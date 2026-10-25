import type { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.ts";
import { initiateOutboundCall } from "../services/vapi.service.ts";
import { AppError } from "../utils/app-error.util.ts";
import type { VapiCallInput } from "../validators/vapi.validator.ts";

export async function startCall(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Authorization token required.", 401);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User account not found.", 404);
    }

    const { phoneNumber, preferredCourse } = req.body as VapiCallInput;

    const result = await initiateOutboundCall({
      phoneNumber,
      studentName: user.name,
      preferredCourse:
        preferredCourse && preferredCourse.trim().length > 0 ? preferredCourse.trim() : undefined,
    });

    res.status(200).json({
      success: true,
      data: {
        callId: result.callId,
        status: result.status,
        message: "Call initiated successfully. You will receive a call shortly.",
      },
    });
  } catch (error: unknown) {
    next(error);
  }
}
