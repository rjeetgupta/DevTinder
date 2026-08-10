import { apiClient, extractErrorMessage } from "./ApiClient";

/**
 * Wraps the REST side of chat (history, inbox list, unread counts).
 * Real-time delivery goes through SocketService, not this class.
 *
 * No input validation needed here — every param is a simple id, not a
 * form. Response is returned as-is; Redux Toolkit owns shaping.
 */
export class ChatService {
  async getChatHistory(targetUserId: string) {
    try {
      const res = await apiClient.get(`/chat/${targetUserId}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load chat history."));
    }
  }

  async getChatList() {
    try {
      const res = await apiClient.get("/chat/list");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load your chats."));
    }
  }

  async getUnreadCount() {
    try {
      const res = await apiClient.get("/chat/unread-count");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load unread count."));
    }
  }

  async isConnected(targetUserId: string) {
    try {
      const res = await apiClient.get(`/chat/is-connected/${targetUserId}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to check connection status."));
    }
  }
}

export const chatService = new ChatService();