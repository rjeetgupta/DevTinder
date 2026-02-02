import { StateCreator } from 'zustand';
import { chatAPI, SendMessageInput, GetMessagesInput } from '@/api/chat.api';
import { Message } from '@/types/user.types';

export interface ChatSlice {
  // State
  messages: Record<string, Message[]>; // userId -> messages
  activeChat: string | null;
  unreadCount: Record<string, number>;
  isLoadingChat: boolean;
  chatError: string | null;

  // Actions
  setActiveChat: (userId: string | null) => void;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  fetchMessages: (userId: string, page?: number) => Promise<void>;
  markMessagesAsRead: (messageIds: string[]) => Promise<void>;
  addMessage: (message: Message) => void; // For real-time updates
  clearChatError: () => void;
}

export const createChatSlice: StateCreator<
  ChatSlice,
  [],
  [],
  ChatSlice
> = (set, get) => ({
  // Initial state
  messages: {},
  activeChat: null,
  unreadCount: {},
  isLoadingChat: false,
  chatError: null,

  // Set active chat
  setActiveChat: (userId) => {
    set({ activeChat: userId });
  },

  // Send message
  sendMessage: async (receiverId, content) => {
    set({ chatError: null });
    
    try {
      const data: SendMessageInput = {
        receiverId,
        content,
      };
      
      const message = await chatAPI.sendMessage(data);
      
      // Add message to state
      set((state) => ({
        messages: {
          ...state.messages,
          [receiverId]: [...(state.messages[receiverId] || []), message],
        },
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send message';
      set({ chatError: errorMessage });
      throw error;
    }
  },

  // Fetch messages
  fetchMessages: async (userId, page = 1) => {
    set({ isLoadingChat: true, chatError: null });
    
    try {
      const data: GetMessagesInput = {
        userId,
        page,
        limit: 50,
      };
      
      const response = await chatAPI.getMessages(data);
      
      set((state) => ({
        messages: {
          ...state.messages,
          [userId]: page === 1 
            ? response.messages 
            : [...(state.messages[userId] || []), ...response.messages],
        },
        isLoadingChat: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch messages';
      set({
        isLoadingChat: false,
        chatError: errorMessage,
      });
      throw error;
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (messageIds) => {
    try {
      await chatAPI.markAsRead({ messageIds });
      
      // Update local state to mark messages as read
      set((state) => {
        const updatedMessages = { ...state.messages };
        
        Object.keys(updatedMessages).forEach((userId) => {
          updatedMessages[userId] = updatedMessages[userId].map((msg) =>
            messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
          );
        });
        
        return { messages: updatedMessages };
      });
    } catch (error: any) {
      console.error('Failed to mark messages as read:', error);
    }
  },

  // Add message (for real-time Socket.io updates)
  addMessage: (message) => {
    set((state) => {
      const userId = message.senderId === get().activeChat 
        ? message.senderId 
        : message.receiverId;
      
      return {
        messages: {
          ...state.messages,
          [userId]: [...(state.messages[userId] || []), message],
        },
        unreadCount: {
          ...state.unreadCount,
          [userId]: message.isRead ? state.unreadCount[userId] : (state.unreadCount[userId] || 0) + 1,
        },
      };
    });
  },

  // Clear error
  clearChatError: () => set({ chatError: null }),
});