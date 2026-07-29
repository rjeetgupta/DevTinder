import axios from "axios";

import { env } from "@/lib/env";

/**
 * Shared axios instance used by every domain service (AuthService,
 * UserService, etc). `withCredentials: true` is required because the
 * backend authenticates via an httpOnly JWT cookie, not a bearer token.
 *
 * Response/error interceptors (e.g. redirect-to-login on 401) are added
 * in Module 3 alongside the Redux store wiring.
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
