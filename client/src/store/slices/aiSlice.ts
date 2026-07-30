import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { aiService } from "@/services/api/AiService";
import { extractErrorMessage } from "@/services/api/ApiClient";
import type { Roadmap } from "@/types";

interface AiState {
  roadmap: Roadmap | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AiState = {
  roadmap: null,
  status: "idle",
  error: null,
};

export const generateRoadmap = createAsyncThunk<Roadmap, void, { rejectValue: string }>(
  "ai/generateRoadmap",
  async (_, { rejectWithValue }) => {
    try {
      return await aiService.suggestCourses();
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "AI service is currently busy. Please try again.")
      );
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateRoadmap.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateRoadmap.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roadmap = action.payload;
      })
      .addCase(generateRoadmap.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "AI service is currently busy. Please try again.";
      });
  },
});

export default aiSlice.reducer;
