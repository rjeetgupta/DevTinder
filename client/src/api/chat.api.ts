import { z } from 'zod';
import axiosInstance from './axios';
import { Message } from '@/types/user.types';

// Validation Schemas
export const sendMessageSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
});

export const getMessagesSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

export const markAsReadSchema = z.object({
  messageIds: z.array(z.string()).min(1, 'At least one message ID required'),
});

// Type exports
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetMessagesInput = z.infer<typeof getMessagesSchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;

// API Response types
export interface ChatConversation {
  userId: string;
  user: {
    _id: string;
    firstName: string;
    lastName?: string;
    photoUrl: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

// API Functions
class ChatAPI {
  // Send message
  async sendMessage(data: unknown) {
    const validatedData = sendMessageSchema.parse(data);
    
    const response = await axiosInstance.post<Message>(
      `/chat/send/${validatedData.receiverId}`,
      { content: validatedData.content }
    );
    
    return response.data;
  }

  // Get messages with a specific user
  async getMessages(data: unknown) {
    const validatedData = getMessagesSchema.parse(data);
    
    const response = await axiosInstance.get<{
      messages: Message[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      };
    }>(`/chat/${validatedData.userId}`, {
      params: {
        page: validatedData.page,
        limit: validatedData.limit,
      },
    });
    
    return response.data;
  }

  // Get all conversations
  async getConversations() {
    const response = await axiosInstance.get<ChatConversation[]>('/chat/conversations');
    return response.data;
  }

  // Mark messages as read
  async markAsRead(data: unknown) {
    const validatedData = markAsReadSchema.parse(data);
    
    const response = await axiosInstance.post<{
      success: boolean;
      updatedCount: number;
    }>('/chat/mark-read', validatedData);
    
    return response.data;
  }

  // Delete message
  async deleteMessage(messageId: string) {
    const response = await axiosInstance.delete(`/chat/message/${messageId}`);
    return response.data;
  }

  // Get unread count
  async getUnreadCount() {
    const response = await axiosInstance.get<{
      total: number;
      byUser: Record<string, number>;
    }>('/chat/unread-count');
    
    return response.data;
  }
}

export const chatAPI = new ChatAPI();