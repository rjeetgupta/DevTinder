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
 *
 * GUARD: a `message` is only trusted as user-safe when status < 500.
 * Backend messages on 4xx are expected to be user-facing (e.g. "Email is
 * already registered."). On 5xx we don't trust `message` even if present,
 * since server errors can carry raw driver/stack text — always fall back
 * to the generic `fallback` string instead. Remove this guard if the
 * backend guarantees 5xx messages are already sanitized.
 */
export function extractErrorMessage(
  error: unknown,
  fallback = "Something went wrong."
): string {
  if (axios.isAxiosError(error)) {
    console.log("Axios Error : ", error)
    const status = error.response?.status ?? 0;
    const data = error.response?.data as { message?: string } | string | undefined;

    if (status >= 500) return fallback;

    if (typeof data === "string") return data;
    if (data?.message) return data.message;
  }
  return fallback;
}

/**
 * Use this in Redux thunks (NOT `extractErrorMessage`). Services already
 * catch the raw AxiosError, run it through `extractErrorMessage`, and
 * rethrow a plain `Error` with a safe `.message`. By the time a thunk's
 * catch block sees it, it's no longer an AxiosError — re-running
 * `extractErrorMessage` on it would always miss and return the fallback,
 * discarding the real message. This just reads `.message` off the Error
 * the service already produced.
 */
export function getErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  return error instanceof Error && error.message ? error.message : fallback;
}