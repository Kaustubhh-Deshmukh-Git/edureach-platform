import { API } from "./api.ts";

export interface ChatResponseData {
  response: string;
}

export interface ChatApiResponse {
  success: boolean;
  data: ChatResponseData;
}

/**
 * Sends a message to the EduReach Campus Assistant RAG endpoint.
 *
 * @param message - User's inquiry (1–1000 characters)
 * @returns res.data.data typed as { response: string }
 */
export async function sendMessage(message: string): Promise<ChatResponseData> {
  const res = await API.post<ChatApiResponse>("/chat/message", { message });
  return res.data.data;
}
