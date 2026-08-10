import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { aiService } from "@/services/api/AiService";
import { getErrorMessage } from "@/services/api/ApiClient";
import type { Roadmap } from "@/types";
import type { RootState } from "@/store/store";

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

function unwrapData<T>(res: unknown): T {
  const data = res as { data?: T };
  return (data?.data ?? res) as T;
}

export const generateRoadmap = createAsyncThunk<
  Roadmap,
  void,
  { rejectValue: string; state: RootState }
>("ai/generateRoadmap", async (_, { rejectWithValue, getState }) => {
  try {
    const skills = getState().auth.user?.skills ?? [];
    const res = await aiService.suggestCourses(skills);
    return unwrapData<Roadmap>(res);
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "AI service is currently busy. Please try again.")
    );
  }
});

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