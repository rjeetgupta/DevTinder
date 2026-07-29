import { apiClient } from "./ApiClient";
import { userSchema, type User } from "@/types";

export interface LoginPayload {
  emailId: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName?: string;
  emailId: string;
  password: string;
}

/**
 * Wraps every auth-related backend endpoint. Slices (authSlice) call
 * these methods inside thunks — components never import this directly.
 */
export class AuthService {
  async login(payload: LoginPayload): Promise<User> {
    const res = await apiClient.post("/login", payload);
    return userSchema.parse(res.data.data);
  }

  async signup(payload: SignupPayload): Promise<User> {
    const res = await apiClient.post("/signup", payload);
    return userSchema.parse(res.data.data);
  }

  async logout(): Promise<void> {
    await apiClient.post("/logout", {});
  }

  async forgotPassword(emailId: string): Promise<void> {
    await apiClient.post("/forgot-password", { emailId });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post(`/reset-password/${token}`, { password });
  }

  /** Fetches the currently authenticated user, used to hydrate auth state on app load. */
  async fetchCurrentUser(): Promise<User> {
    const res = await apiClient.get("/profile/view");
    return userSchema.parse(res.data.data ?? res.data);
  }
}

export const authService = new AuthService();
