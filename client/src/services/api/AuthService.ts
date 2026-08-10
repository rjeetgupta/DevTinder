import { apiClient, extractErrorMessage } from "./ApiClient";
import { loginSchema, signupSchema, resetPasswordSchema } from "@/lib/validation/authSchemas";

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
 * Pattern for every method:
 *  1. Validate input with existing Zod schema -> throw a plain Error
 *     with the first Zod issue message if invalid. Nothing invalid
 *     ever reaches the network.
 *  2. Send the validated (`parsed.data`) payload.
 *  3. Return `res.data` as-is — Redux Toolkit owns response shaping.
 *  4. On failure (network/backend), rethrow a plain Error built from
 *     `extractErrorMessage` (reused from ApiClient.ts, unmodified call
 *     site) — guaranteed safe to render, with an action-specific
 *     fallback for when the backend sends nothing usable.
 */
export class AuthService {
  async login(payload: LoginPayload) {
    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? "Please check your input.");
    }

    try {
      const res = await apiClient.post("/auth/login", parsed.data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to log in. Please try again."));
    }
  }

  async signup(payload: SignupPayload) {
    const parsed = signupSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? "Please check your input.");
    }

    try {
      const res = await apiClient.post("/auth/register", parsed.data);
      console.log("Service auth : ", res)
      return res.data;
    } catch (error) {
      console.log("Auth service error , ", error);
      throw new Error(extractErrorMessage(error, "Unable to sign up. Please try again."));
    }
  }

  async logout() {
    try {
      await apiClient.post("/auth/logout", {});
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to log out. Please try again."));
    }
  }

  async forgotPassword(email: string) {
    try {
      await apiClient.post("/auth/forgot-password", { emailId: email });
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Unable to process this request. Please try again.")
      );
    }
  }

  async resetPassword(token: string, password: string) {
    const parsed = resetPasswordSchema.safeParse({ password });
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? "Please check your input.");
    }

    try {
      const res = await apiClient.post(`/auth/reset-password/${token}`, parsed.data);
      return res.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Unable to reset password. The link may be invalid or expired.")
      );
    }
  }

  async fetchCurrentUser() {
    try {
      const res = await apiClient.get("/profile");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load your profile."));
    }
  }
}

export const authService = new AuthService();