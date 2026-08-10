import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/services/api/ApiClient";
import { matchService } from "@/services/api/MatchService";
import { userService } from "@/services/api/UserService";
import type { SendStatus, User } from "@/types";

interface FeedState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  /** Tracks which user id currently has a pending connect/ignore request in flight. */
  pendingUserId: string | null;
}

const initialState: FeedState = {
  users: [],
  status: "idle",
  error: null,
  pendingUserId: null,
};

function unwrapArray<T>(res: unknown): T[] {
  const data = res as { data?: T[] } | T[];
  return Array.isArray(data) ? data : data?.data ?? [];
}

/** UserService.isConnected's original impl read `res.data.isConnected`
 *  directly (no `data` wrapper) — preserved here since the service no
 *  longer does this unwrapping itself. */
function unwrapIsConnected(res: unknown): boolean {
  return Boolean((res as { isConnected?: boolean })?.isConnected);
}

export const fetchFeed = createAsyncThunk<User[], void, { rejectValue: string }>(
  "feed/fetchFeed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.getFeed();
      return unwrapArray<User>(res);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not load your feed."));
    }
  }
);

export const sendFeedRequest = createAsyncThunk<
  { userId: string; status: SendStatus },
  { userId: string; status: SendStatus },
  { rejectValue: string }
>("feed/sendRequest", async ({ userId, status }, { rejectWithValue }) => {
  try {
    await matchService.sendRequest(status, userId);
    return { userId, status };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Action failed."));
  }
});

/**
 * Used by the "Chat" button to gate navigation: only connected users (or
 * premium members) can open a chat thread. No slice state needed for this
 * one — components call `dispatch(checkIsConnected(id)).unwrap()` directly.
 */
export const checkIsConnected = createAsyncThunk<boolean, string, { rejectValue: string }>(
  "feed/checkIsConnected",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await userService.isConnected(userId);
      return unwrapIsConnected(res);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not check connection status."));
    }
  }
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    removeUserFromFeed(state, action: PayloadAction<string>) {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Could not load your feed.";
      })
      .addCase(sendFeedRequest.pending, (state, action) => {
        state.pendingUserId = action.meta.arg.userId;
      })
      .addCase(sendFeedRequest.fulfilled, (state, action) => {
        state.pendingUserId = null;
        state.users = state.users.filter((u) => u._id !== action.payload.userId);
      })
      .addCase(sendFeedRequest.rejected, (state) => {
        state.pendingUserId = null;
      });
  },
});

export const { removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;