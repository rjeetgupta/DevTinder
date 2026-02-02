import { StateCreator } from 'zustand';
import {
  connectionAPI,
  SendConnectionInput,
  ReviewConnectionInput,
  FeedPaginationInput,
} from '@/api/connection.api';
import { ConnectionRequest, User } from '@/types/user.types';

export interface ConnectionSlice {
  // State
  receivedRequests: ConnectionRequest[];
  sentRequests: ConnectionRequest[];
  matches: ConnectionRequest[];
  feedUsers: User[];
  feedPagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  isLoadingConnections: boolean;
  connectionError: string | null;

  // Actions
  sendConnectionRequest: (toUserId: string, status: 'interested' | 'ignored') => Promise<void>;
  reviewConnectionRequest: (requestId: string, status: 'accepted' | 'rejected') => Promise<void>;
  fetchReceivedRequests: () => Promise<void>;
  fetchSentRequests: () => Promise<void>;
  fetchMatches: () => Promise<void>;
  fetchFeedUsers: (params?: Partial<FeedPaginationInput>) => Promise<void>;
  clearConnectionError: () => void;
}

export const createConnectionSlice: StateCreator<
  ConnectionSlice,
  [],
  [],
  ConnectionSlice
> = (set, get) => ({
  // Initial state
  receivedRequests: [],
  sentRequests: [],
  matches: [],
  feedUsers: [],
  feedPagination: null,
  isLoadingConnections: false,
  connectionError: null,

  // Send connection request
  sendConnectionRequest: async (toUserId, status) => {
    set({ connectionError: null });
    
    try {
      const data: SendConnectionInput = {
        toUserId,
        status,
      };
      
      await connectionAPI.sendConnectionRequest(data);
      
      // Remove user from feed locally
      set((state) => ({
        feedUsers: state.feedUsers.filter((user) => user._id !== toUserId),
      }));
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to send connection request';
      set({ connectionError: errorMessage });
      throw error;
    }
  },

  // Review connection request
  reviewConnectionRequest: async (requestId, status) => {
    set({ isLoadingConnections: true, connectionError: null });
    
    try {
      const data: ReviewConnectionInput = {
        requestId,
        status,
      };
      
      await connectionAPI.reviewConnectionRequest(data);
      
      // Remove from received requests
      set((state) => ({
        receivedRequests: state.receivedRequests.filter(
          (req) => req._id !== requestId
        ),
        isLoadingConnections: false,
      }));
      
      // If accepted, refresh matches
      if (status === 'accepted') {
        await get().fetchMatches();
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to review connection request';
      set({
        isLoadingConnections: false,
        connectionError: errorMessage,
      });
      throw error;
    }
  },

  // Fetch received requests
  fetchReceivedRequests: async () => {
    set({ isLoadingConnections: true, connectionError: null });
    
    try {
      const requests = await connectionAPI.getReceivedRequests();
      
      set({
        receivedRequests: requests,
        isLoadingConnections: false,
      });
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch received requests';
      set({
        isLoadingConnections: false,
        connectionError: errorMessage,
      });
      throw error;
    }
  },

  // Fetch sent requests
  fetchSentRequests: async () => {
    set({ isLoadingConnections: true, connectionError: null });
    
    try {
      const requests = await connectionAPI.getSentRequests();
      
      set({
        sentRequests: requests,
        isLoadingConnections: false,
      });
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch sent requests';
      set({
        isLoadingConnections: false,
        connectionError: errorMessage,
      });
      throw error;
    }
  },

  // Fetch matches
  fetchMatches: async () => {
    set({ isLoadingConnections: true, connectionError: null });
    
    try {
      const matches = await connectionAPI.getMatches();
      
      set({
        matches,
        isLoadingConnections: false,
      });
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch matches';
      set({
        isLoadingConnections: false,
        connectionError: errorMessage,
      });
      throw error;
    }
  },

  // Fetch feed users
  fetchFeedUsers: async (params) => {
    set({ isLoadingConnections: true, connectionError: null });
    
    try {
      const response = await connectionAPI.getFeedUsers(params);
      
      set({
        feedUsers: response.users,
        feedPagination: response.pagination,
        isLoadingConnections: false,
      });
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch feed users';
      set({
        isLoadingConnections: false,
        connectionError: errorMessage,
      });
      throw error;
    }
  },

  // Clear error
  clearConnectionError: () => set({ connectionError: null }),
});