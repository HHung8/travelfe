import Constants from "expo-constants";
import { Platform } from "react-native";
import { AuthData } from "../types/auth";

function resolveBaseUrl() : string {
  const PORT = 5167;
  const hostUri = Constants.expoConfig?.hostUri ?? 
  (Constants.manifest2 as any)?.extra?.expoGo?.debuggerHost;
  const debuggerHost = hostUri?.split(":")[0];
  if(debuggerHost) {
    return `http://${debuggerHost}:${PORT}/api`
  }
  if(Platform.OS === "android") {
    return `http://10.0.2.2:${PORT}/api`;
  }
  return `http://localhost:${PORT}/api`;
}

const BASE_URL = resolveBaseUrl();


type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T | null;
    errors: unknown;
};

function friendlyErrorMessage(raw: string, status: number): string {
    if(status === 401) return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
    if(status >= 500) return "Hệ thống đang gặp sự cố, vui lòng thử lại sau.";
    return raw.length > 200 ? "Có lỗi xảy ra, vui lòng thử lại." : raw; 
}

async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
    const rawText = await res.text();
    let json: ApiResponse<T> | null = null;
    try {
        json = rawText ? JSON.parse(rawText) : null;
    } catch {
        // Backend trả về text thuần thay vì JSON envelope
        console.log("RAW RESPONSE (not JSON):", rawText);
        throw new Error(friendlyErrorMessage(rawText, res.status));
    }
    if(!res.ok || !json?.success) {  
        throw new Error(friendlyErrorMessage(json?.message || rawText || `Lỗi không xác định (status ${res.status})`, res.status));
    }
    return json;

}

async function request<T>(path: string, body: Record<string, unknown>): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { Accept: "*/*", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(res);
}

export async function getWithAuth<T>(
  path: string,
  token: string | null,
  params?: Record<string, string | number | undefined>
): Promise<ApiResponse<T>> {
  const query = params
    ? "?" +
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";

  const res = await fetch(`${BASE_URL}${path}${query}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return parseResponse<T>(res);
}

export async function postWithAuth<T, B extends object = Record<string, unknown>>(
  path: string,
  token: string | null,
  body: B
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(res);
}

export function loginApi(email: string, password: string) {
  return request<AuthData>("/auth/login", { email, password });
}

export function registerApi(fullName: string, email: string, password: string, phone: string) {
  return request<AuthData>("/auth/register", { fullName, email, password, phone });
}