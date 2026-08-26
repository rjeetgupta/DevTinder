import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserStatusPayload {
  userId: string;
  online: boolean;
}

interface UserStatusState {
  onlineUsers: Record<string, boolean>;
}

const initialState: UserStatusState = {
  onlineUsers: {},
};

const userStatusSlice = createSlice({
  name: "userStatus",
  initialState,
  reducers: {
    userStatusChanged(
      state,
      action: PayloadAction<UserStatusPayload>
    ) {
      const { userId, online } = action.payload;

      state.onlineUsers[userId] = online;
    },

    clearUserStatuses(state) {
      state.onlineUsers = {};
    },
  },
});

export const {
  userStatusChanged,
  clearUserStatuses,
} = userStatusSlice.actions;

export default userStatusSlice.reducer;