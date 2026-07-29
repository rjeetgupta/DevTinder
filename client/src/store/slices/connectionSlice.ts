import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { extractErrorMessage } from "@/services/api/ApiClient";
import { matchService } from "@/services/api/MatchService";
import type { User } from "@/types";

interface ConnectionState {
  connections: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ConnectionState = {
  connections: [],
  status: "idle",
  error: null,
};

export const fetchConnections = createAsyncThunk<User[], void, { rejectValue: string }>(
  "connections/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await matchService.getConnections();
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Could not load your connections."));
    }
  }
);

const connectionSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnections.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.connections = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Could not load your connections.";
      });
  },
});

export default connectionSlice.reducer;
