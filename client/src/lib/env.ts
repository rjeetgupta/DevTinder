/**
 * Centralized environment configuration.
 * Keeps `process.env` access in one place so the rest of the app
 * never reads `process.env.*` directly.
 */
export const env = {
  /** Base URL of the existing Express backend REST API, e.g. http://localhost:7777/api */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
  /** Base URL of the Socket.io server, e.g. http://localhost:7777 */
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:7777",
} as const;
