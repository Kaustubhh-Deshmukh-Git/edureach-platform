import { z } from "zod";

export const chatSchema = z.object({
  message: z
    .string({ required_error: "Message is required." })
    .trim()
    .min(1, "Message cannot be empty.")
    .max(1000, "Message cannot exceed 1000 characters."),
});

export type ChatInput = z.infer<typeof chatSchema>;
