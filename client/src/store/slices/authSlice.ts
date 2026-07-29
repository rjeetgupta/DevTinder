import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { extractErrorMessage } from "@/services/api/ApiClient";
import { authService, type LoginPayload, type SignupPayload } from "@/services/api/AuthService";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  /** True only while we're checking for an existing session on app load. */
  isBootstrapping: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isBootstrapping: true,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<User, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.login(payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Invalid email or password."));
    }
  }
);

export const signup = createAsyncThunk<User, SignupPayload, { rejectValue: string }>(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.signup(payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Could not create your account."));
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if the backend call fails, the client-side session should
      // still clear — so we don't reject here, just log for visibility.
      console.error("Logout request failed:", extractErrorMessage(error));
    }
  }
);

/** Runs once on app load to silently restore a session from the auth cookie. */
export const bootstrapAuth = createAsyncThunk<User | null>(
  "auth/bootstrap",
  async () => {
    try {
      return await authService.fetchCurrentUser();
    } catch {
      return null;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Called by ApiClient's 401 interceptor via the store's unauthorized handler. */
    sessionExpired(state) {
      state.user = null;
      state.status = "idle";
    },
    updateCurrentUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed.";
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Signup failed.";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(bootstrapAuth.pending, (state) => {
        state.isBootstrapping = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isBootstrapping = false;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.user = null;
        state.isBootstrapping = false;
      });
  },
});

export const { sessionExpired, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;
