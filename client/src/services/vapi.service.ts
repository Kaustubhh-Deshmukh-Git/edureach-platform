import { API } from "./api.ts";

export interface InitiateCallParams {
  phone: string;
  course?: string;
  topic?: string;
}

export interface VapiCallResponseData {
  callId: string;
  status: string;
  message: string;
}

export interface VapiCallApiResponse {
  success: boolean;
  data: VapiCallResponseData;
}

/**
 * Initiates an outbound AI voice call to the user.
 *
 * @param params - User's phone number, optional course, and optional counseling topic
 * @returns res.data with { success, data: { callId, status, message } }
 */
export async function initiateCall(params: InitiateCallParams): Promise<VapiCallApiResponse> {
  const { phone, course, topic } = params;
  const cleanCourse = course?.trim();
  const cleanTopic = topic?.trim();

  const preferredCourse =
    cleanCourse && cleanTopic
      ? `${cleanCourse} - ${cleanTopic}`
      : cleanCourse || cleanTopic || undefined;

  const payload: { phoneNumber: string; preferredCourse?: string } = {
    phoneNumber: phone.trim(),
  };

  if (preferredCourse) {
    payload.preferredCourse = preferredCourse;
  }

  const res = await API.post<VapiCallApiResponse>("/vapi/call", payload);
  return res.data;
}
