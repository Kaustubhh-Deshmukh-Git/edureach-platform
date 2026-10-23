import type { Request, Response, NextFunction } from "express";
import { getRAGResponse } from "../services/rag.service.ts";
import { AppError } from "../utils/app-error.util.ts";
import type { ChatInput } from "../validators/chat.validator.ts";

export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { message } = req.body as ChatInput;
    const response = await getRAGResponse(message);

    res.status(200).json({
      success: true,
      data: {
        response,
      },
    });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(new AppError("The assistant is temporarily unavailable. Please try again.", 502));
  }
}
