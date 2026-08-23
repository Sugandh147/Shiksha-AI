/**
 * src/lib/api.ts
 * ───────────────
 * Centralized Axios API client.
 *
 * Every API call from any component goes through this client.
 * Benefits:
 *   • One place to set base URL (Backend FastAPI server)
 *   • Automatically attaches JWT token to every request
 *   • Consistent error handling across the app
 */

import axios, { AxiosError } from "axios";

// The FastAPI backend URL — change this if backend runs on a different port
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// ── Request Interceptor: Attach JWT token to every request ────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage (stored after login)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("shikshaai_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle auth errors globally ────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("shikshaai_token");
        localStorage.removeItem("shikshaai_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ── Typed API helpers ─────────────────────────────────────────────────────────

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, { params }).then((r) => r.data),

  post: <T>(url: string, data?: unknown) =>
    apiClient.post<T>(url, data).then((r) => r.data),

  postForm: <T>(url: string, formData: FormData) =>
    apiClient.post<T>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),

  put: <T>(url: string, data?: unknown) =>
    apiClient.put<T>(url, data).then((r) => r.data),

  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((r) => r.data),
};

export default api;
