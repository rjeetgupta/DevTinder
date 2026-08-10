import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/services/api/ApiClient";
import { chatService } from "@/services/api/ChatService";
import { matchService } from "@/services/api/MatchService";
import type { ChatListItem, ChatMessage } from "@/types";

interface ChatState {
  list: ChatListItem[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;

  activeUserId: string | null;
  messages: ChatMessage[];
  messagesStatus: "idle" | "loading" | "succeeded" | "failed";
  messagesError: string | null;
}

const initialState: ChatState = {
  list: [],
  listStatus: "idle",
  listError: null,
  activeUserId: null,
  messages: [],
  messagesStatus: "idle",
  messagesError: null,
};

// Services now return the raw backend envelope — unwrap here, same shape
// the service used to unwrap internally.
function unwrapList(res: unknown): ChatListItem[] {
  const data = res as { data?: ChatListItem[] } | ChatListItem[];
  return Array.isArray(data) ? data : data?.data ?? [];
}

function unwrapMessages(res: unknown): ChatMessage[] {
  const data = res as { data?: { messages?: ChatMessage[] }; messages?: ChatMessage[] };
  return data?.data?.messages ?? data?.messages ?? [];
}

export const fetchChatList = createAsyncThunk<ChatListItem[], void, { rejectValue: string }>(
  "chat/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await chatService.getChatList();
      return unwrapList(res);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not load your chats."));
    }
  }
);

export const fetchChatHistory = createAsyncThunk<ChatMessage[], string, { rejectValue: string }>(
  "chat/fetchHistory",
  async (targetUserId, { rejectWithValue }) => {
    try {
      const res = await chatService.getChatHistory(targetUserId);
      return unwrapMessages(res);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not load this conversation."));
    }
  }
);

/** Used by the "Connect" button inside a chat's user-detail dialog. */
export const sendConnectionRequestFromChat = createAsyncThunk<void, string, { rejectValue: string }>(
  "chat/sendConnectionRequest",
  async (targetUserId, { rejectWithValue }) => {
    try {
      await matchService.sendRequest("intrested", targetUserId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to connect."));
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveUserId(state, action: PayloadAction<string | null>) {
      state.activeUserId = action.payload;
      state.messages = [];
      state.messagesStatus = "idle";
      // Opening a conversation clears its unread badge locally; the
      // server is told via `SocketService.markSeen` by the caller.
      if (action.payload) {
        const item = state.list.find((c) => c.user._id === action.payload);
        if (item) item.unreadCount = 0;
      }
    },
    /** Called from the `receiveMessage` socket event. */
    messageReceived(
      state,
      action: PayloadAction<{ senderId: string; text: string; createdAt?: string; _id?: string }>
    ) {
      const { senderId, text, createdAt, _id } = action.payload;
      const isActiveChat = state.activeUserId === senderId;

      if (isActiveChat) {
        state.messages.push({ _id, senderId, text, createdAt, seen: false });
      }

      const existing = state.list.find((c) => c.user._id === senderId);
      if (existing) {
        existing.lastMessage = text;
        existing.lastMessageAt = createdAt ?? new Date().toISOString();
        if (!isActiveChat) existing.unreadCount += 1;
      }
    },
    /** Called from the `messagesSeen` socket event — marks our own sent messages as read. */
    ownMessagesMarkedSeen(state) {
      state.messages = state.messages.map((m) =>
        m.senderId !== state.activeUserId ? m : { ...m, seen: true }
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatList.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchChatList.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload ?? "Could not load your chats.";
      })
      .addCase(fetchChatHistory.pending, (state) => {
        state.messagesStatus = "loading";
        state.messagesError = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.messagesStatus = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.messagesStatus = "failed";
        state.messagesError = action.payload ?? "Could not load this conversation.";
      });
  },
});

export const { setActiveUserId, messageReceived, ownMessagesMarkedSeen } = chatSlice.actions;
export default chatSlice.reducer;