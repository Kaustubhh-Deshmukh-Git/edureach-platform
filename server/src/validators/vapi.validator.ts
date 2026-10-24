import { z } from "zod";

export const vapiCallSchema = z.object({
  phoneNumber: z
    .string({ required_error: "Phone number is required." })
    .trim()
    .regex(
      /^[6-9][0-9]{9}$/,
      "Phone number must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.",
    ),
  preferredCourse: z
    .string()
    .trim()
    .max(120, "Preferred course cannot exceed 120 characters.")
    .optional()
    .or(z.literal("")),
});

export type VapiCallInput = z.infer<typeof vapiCallSchema>;
