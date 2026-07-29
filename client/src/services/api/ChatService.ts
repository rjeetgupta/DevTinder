import { apiClient } from "./ApiClient";
import { chatListSchema, chatMessageSchema, type ChatListItem, type ChatMessage } from "@/types";

/**
 * Wraps the REST side of chat (history, inbox list, unread counts).
 * Real-time delivery goes through SocketService, not this class.
 */
export class ChatService {
  async getChatHistory(targetUserId: string): Promise<ChatMessage[]> {
    const res = await apiClient.get(`/chat/${targetUserId}`);
    const messages = res.data?.data?.messages ?? res.data?.messages ?? [];
    return messages.map((m: unknown) => chatMessageSchema.parse(m));
  }

  async getChatList(): Promise<ChatListItem[]> {
    const res = await apiClient.get("/chat/list");
    return chatListSchema.parse(res.data.data ?? res.data);
  }

  async getUnreadCount(): Promise<number> {
    const res = await apiClient.get("/chat/unread-count");
    return Number(res.data.data?.count ?? res.data.count ?? 0);
  }

  async isConnected(targetUserId: string): Promise<boolean> {
    const res = await apiClient.get(`/chat/is-connected/${targetUserId}`);
    return Boolean(res.data.data ?? res.data);
  }
}

export const chatService = new ChatService();
