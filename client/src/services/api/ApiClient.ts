import axios, { AxiosError } from "axios";

import { env } from "@/lib/env";

/**
 * Shared axios instance used by every domain service (AuthService,
 * UserService, etc). `withCredentials: true` is required because the
 * backend authenticates via an httpOnly JWT cookie, not a bearer token.
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Called whenever a request comes back 401. The Redux layer registers a
 * handler here (via `registerUnauthorizedHandler`) instead of this module
 * importing the store directly, which would create a circular dependency
 * (store -> slice -> service -> store).
 */
let unauthorizedHandler: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

/**
 * Every backend error response follows `{ message: string }` (sometimes
 * nested oddly, but `message` is always present). Services funnel axios
 * errors through this so thunks/components get a plain, predictable string.
 */
export function extractErrorMessage(
  error: unknown,
  fallback = "Something went wrong."
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | string | undefined;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
  }
  return fallback;
}
