import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { extractErrorMessage } from "@/services/api/ApiClient";
import { paymentService } from "@/services/api/PaymentService";
import type { CreateOrderResponse, MembershipType } from "@/types";

interface PremiumState {
  isPremium: boolean;
  verifyStatus: "idle" | "loading" | "succeeded" | "failed";
  orderStatus: "idle" | "loading" | "succeeded" | "failed";
  orderError: string | null;
}

const initialState: PremiumState = {
  isPremium: false,
  verifyStatus: "idle",
  orderStatus: "idle",
  orderError: null,
};

export const verifyPremiumStatus = createAsyncThunk<boolean>(
  "premium/verify",
  async () => {
    try {
      return await paymentService.verifyPremium();
    } catch {
      return false;
    }
  }
);

export const createPremiumOrder = createAsyncThunk<
  CreateOrderResponse,
  MembershipType,
  { rejectValue: string }
>("premium/createOrder", async (membershipType, { rejectWithValue }) => {
  try {
    return await paymentService.createOrder(membershipType);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Unable to initiate payment."));
  }
});

const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    /** Set locally right after the Razorpay checkout handler confirms success. */
    markPremiumActive(state) {
      state.isPremium = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyPremiumStatus.pending, (state) => {
        state.verifyStatus = "loading";
      })
      .addCase(verifyPremiumStatus.fulfilled, (state, action) => {
        state.verifyStatus = "succeeded";
        state.isPremium = action.payload;
      })
      .addCase(verifyPremiumStatus.rejected, (state) => {
        state.verifyStatus = "failed";
      })
      .addCase(createPremiumOrder.pending, (state) => {
        state.orderStatus = "loading";
        state.orderError = null;
      })
      .addCase(createPremiumOrder.fulfilled, (state) => {
        state.orderStatus = "succeeded";
      })
      .addCase(createPremiumOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.payload ?? "Unable to initiate payment.";
      });
  },
});

export const { markPremiumActive } = premiumSlice.actions;
export default premiumSlice.reducer;
