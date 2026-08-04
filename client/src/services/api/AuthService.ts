import { apiClient } from "./ApiClient";
import { userSchema, type User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

/**
 * Extracts the user object from a `{ data: { loggedInUser: {...} } }`
 * style envelope. Falls back to a couple of alternate key names in case
 * signup/other endpoints label the nested object differently (e.g.
 * `registeredUser`) — makes parsing resilient without guessing wrong
 * and throwing.
 */
function unwrapUser(responseData: unknown): unknown {
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    const inner = (responseData as { data: unknown }).data;
    if (inner && typeof inner === "object") {
      const obj = inner as Record<string, unknown>;
      return obj.loggedInUser ?? obj.registeredUser ?? obj.user ?? inner;
    }
    return inner;
  }
  return responseData;
}

/**
 * Wraps every auth-related backend endpoint. Slices (authSlice) call
 * these methods inside thunks — components never import this directly.
 */
export class AuthService {
  async login(payload: LoginPayload): Promise<User> {
    const res = await apiClient.post("/auth/login", payload);
    return userSchema.parse(unwrapUser(res.data));
  }

  async signup(payload: SignupPayload): Promise<User> {
    const res = await apiClient.post("/auth/register", payload);
    return userSchema.parse(unwrapUser(res.data));
  }

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout", {});
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post(`/auth/reset-password/${token}`, { password });
  }

  /** Fetches the currently authenticated user, used to hydrate auth state on app load. */
  async fetchCurrentUser(): Promise<User> {
    const res = await apiClient.get("/auth/profile");
    return userSchema.parse(unwrapUser(res.data));
  }
}

export const authService = new AuthService();
