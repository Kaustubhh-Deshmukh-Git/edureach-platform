import axios from "axios";
import { API } from "./api.ts";
import type {
  RegisterPayload,
  LoginPayload,
  AuthResponseData,
  UserResponseData,
  ApiResponse,
} from "../types/index.ts";

export async function registerUser(payload: RegisterPayload): Promise<AuthResponseData> {
  const res = await API.post<ApiResponse<AuthResponseData>>("/auth/register", payload);
  return res.data.data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponseData> {
  const res = await API.post<ApiResponse<AuthResponseData>>("/auth/login", payload);
  return res.data.data;
}

export async function getMe(): Promise<UserResponseData> {
  const res = await API.get<ApiResponse<UserResponseData>>("/auth/me");
  return res.data.data;
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
    if (err.message) {
      return err.message;
    }
  } else if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred. Please try again.";
}
