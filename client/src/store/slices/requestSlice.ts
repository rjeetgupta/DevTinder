import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/services/api/ApiClient";
import { matchService } from "@/services/api/MatchService";
import type { ConnectionRequest, ReviewStatus, SendStatus, User } from "@/types";

interface RequestState {
  received: ConnectionRequest[];
  receivedStatus: "idle" | "loading" | "succeeded" | "failed";
  receivedError: string | null;

  ignored: User[];
  ignoredStatus: "idle" | "loading" | "succeeded" | "failed";
  ignoredError: string | null;

  /** id of the request/user currently being acted on (accept/reject/resend). */
  pendingId: string | null;
}

const initialState: RequestState = {
  received: [],
  receivedStatus: "idle",
  receivedError: null,
  ignored: [],
  ignoredStatus: "idle",
  ignoredError: null,
  pendingId: null,
};

function unwrapArray<T>(res: unknown): T[] {
  const data = res as { data?: T[] } | T[];
  return Array.isArray(data) ? data : data?.data ?? [];
}

export const fetchReceivedRequests = createAsyncThunk<ConnectionRequest[], void, { rejectValue: string }>(
  "requests/fetchReceived",
  async (_, { rejectWithValue }) => {
    try {
      const res = await matchService.getReceivedRequests();
      return unwrapArray<ConnectionRequest>(res);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not load requests."));
    }
  }
);

export const reviewRequest = createAsyncThunk<
  { requestId: string },
  { requestId: string; status: ReviewStatus },
  { rejectValue: string }
>("requests/review", async ({ requestId, status }, { rejectWithValue }) => {
  try {
    await matchService.reviewRequest(status, requestId);
    return { requestId };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Could not review this request."));
  }
});

export const fetchIgnoredUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "requests/fetchIgnored",
  async (_, { rejectWithValue }) => {
    try {
      const res = await matchService.getIgnoredRequests();
      return unwrapArray<User>(res);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not load ignored users."));
    }
  }
);

export const resendRequest = createAsyncThunk<
  { userId: string },
  { userId: string; status: SendStatus },
  { rejectValue: string }
>("requests/resend", async ({ userId, status }, { rejectWithValue }) => {
  try {
    await matchService.resendRequest(status, userId);
    return { userId };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Action failed."));
  }
});

const requestSlice = createSlice({
  name: "requests",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceivedRequests.pending, (state) => {
        state.receivedStatus = "loading";
        state.receivedError = null;
      })
      .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
        state.receivedStatus = "succeeded";
        state.received = action.payload;
      })
      .addCase(fetchReceivedRequests.rejected, (state, action) => {
        state.receivedStatus = "failed";
        state.receivedError = action.payload ?? "Could not load requests.";
      })
      .addCase(reviewRequest.pending, (state, action) => {
        state.pendingId = action.meta.arg.requestId;
      })
      .addCase(reviewRequest.fulfilled, (state, action) => {
        state.pendingId = null;
        state.received = state.received.filter((r) => r._id !== action.payload.requestId);
      })
      .addCase(reviewRequest.rejected, (state) => {
        state.pendingId = null;
      })
      .addCase(fetchIgnoredUsers.pending, (state) => {
        state.ignoredStatus = "loading";
        state.ignoredError = null;
      })
      .addCase(fetchIgnoredUsers.fulfilled, (state, action) => {
        state.ignoredStatus = "succeeded";
        state.ignored = action.payload;
      })
      .addCase(fetchIgnoredUsers.rejected, (state, action) => {
        state.ignoredStatus = "failed";
        state.ignoredError = action.payload ?? "Could not load ignored users.";
      })
      .addCase(resendRequest.pending, (state, action) => {
        state.pendingId = action.meta.arg.userId;
      })
      .addCase(resendRequest.fulfilled, (state, action) => {
        state.pendingId = null;
        state.ignored = state.ignored.filter((u) => u._id !== action.payload.userId);
      })
      .addCase(resendRequest.rejected, (state) => {
        state.pendingId = null;
      });
  },
  reducers: {},
});

export default requestSlice.reducer;