import { User } from "@/types/user.types";
import { ApiResponse } from "@/types/api.types";

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginApiResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  loggedInUser: User;
}>;

export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export type RegisterApiResponse = ApiResponse<{
  loggedInUser: User;
}>

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
};
