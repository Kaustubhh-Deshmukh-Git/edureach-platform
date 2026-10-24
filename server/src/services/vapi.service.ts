import { env } from "../config/env.config.ts";
import { logger } from "../utils/logger.util.ts";
import { AppError } from "../utils/app-error.util.ts";

export interface OutboundCallParams {
  phoneNumber: string;
  studentName: string;
  preferredCourse?: string;
}

export interface OutboundCallResult {
  callId: string;
  status: string;
}

export interface VapiCallApiResponse {
  id: string;
  status: string;
  [key: string]: unknown;
}

/**
 * Strips control characters (\x00-\x1F, \x7F), newlines, and excess whitespace.
 * Enforces length cap.
 */
export function sanitizePromptText(text: string, maxLength = 80): string {
  return text
    .replace(/[\x00-\x1F\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/**
 * Normalizes Indian mobile number to E.164 (+91XXXXXXXXXX).
 * Accepts:
 *   - 10-digit: 9876543210
 *   - 12-digit with 91: 919876543210
 *   - 13-digit with +91: +919876543210
 */
export function normalizeIndianPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, "");

  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return cleaned;
  }
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }

  throw new AppError("Invalid phone number. Must be a valid 10-digit Indian mobile number.", 400);
}

/**
 * Masks phone number for logging: +91******3210
 */
export function maskPhoneNumber(phone: string): string {
  if (phone.length >= 8) {
    const prefix = phone.startsWith("+91") ? "+91" : phone.slice(0, 3);
    const last4 = phone.slice(-4);
    return `${prefix}******${last4}`;
  }
  return "****";
}

/**
 * Initiates an outbound phone call via Vapi to a prospective student.
 */
export async function initiateOutboundCall(
  params: OutboundCallParams,
): Promise<OutboundCallResult> {
  const normalizedPhone = normalizeIndianPhoneNumber(params.phoneNumber);
  const cleanName = sanitizePromptText(params.studentName, 50) || "Student";
  const cleanCourse = params.preferredCourse
    ? sanitizePromptText(params.preferredCourse, 100)
    : undefined;

  const firstMessage = cleanCourse
    ? `Hello ${cleanName}! I'm Ava from EduReach College. I understand you're interested in our ${cleanCourse} program. How can I help you today?`
    : `Hello ${cleanName}! I'm Ava from EduReach College. How can I help you today?`;

  const payload = {
    assistantId: env.VAPI_ASSISTANT_ID,
    phoneNumberId: env.VAPI_PHONE_NUMBER_ID,
    customer: {
      number: normalizedPhone,
      name: cleanName,
    },
    assistantOverrides: {
      firstMessage,
    },
  };

  const masked = maskPhoneNumber(normalizedPhone);
  logger.info(
    {
      phone: masked,
      assistantId: env.VAPI_ASSISTANT_ID,
    },
    "Initiating Vapi outbound call",
  );

  try {
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.VAPI_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000), // 12-second timeout (between 10-15s)
    });

    if (!response.ok) {
      let errorBody = "";
      try {
        errorBody = await response.text();
      } catch {
        // ignore body read errors
      }
      logger.error(
        {
          status: response.status,
          phone: masked,
          errorBody,
        },
        "Vapi outbound call rejected by upstream API",
      );
      throw new AppError("Failed to initiate voice call. Please try again later.", 502);
    }

    const data = (await response.json()) as VapiCallApiResponse;

    if (!data || typeof data !== "object" || !data.id) {
      throw new AppError("Invalid response format received from voice agent provider.", 502);
    }

    logger.info(
      {
        callId: data.id,
        status: data.status,
        phone: masked,
      },
      "Vapi outbound call initiated successfully",
    );

    return {
      callId: String(data.id),
      status: String(data.status ?? "queued"),
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error(
      {
        err: error,
        phone: masked,
      },
      "Network or unexpected error while calling Vapi API",
    );
    throw new AppError("Failed to initiate voice call. Please try again later.", 502);
  }
}
