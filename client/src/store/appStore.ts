import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createConnectionSlice, ConnectionSlice } from './slices/connectionSlice';
import { createChatSlice, ChatSlice } from './slices/chatSlice';
import { createPaymentSlice, PaymentSlice } from './slices/paymentSlice';
import { shallow, useShallow } from "zustand/shallow";

// Combined store type
type AppStore = AuthSlice & UserSlice & ConnectionSlice & ChatSlice & PaymentSlice;

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createUserSlice(...a),
        ...createConnectionSlice(...a),
        ...createChatSlice(...a),
        ...createPaymentSlice(...a),
      }),
      {
        name: 'devtinder-storage',
        partialize: (state) => ({
          currentUser: state.currentUser,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'DevTinder Store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Selector hooks
export const useAuth = () =>
  useAppStore(
    useShallow(
      (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        login: state.login,
        registerr: state.register,
        logout: state.logout,
        clearError: state.clearError,
      })
    )
  );

export const useProfiles = () =>
  useAppStore(
    useShallow(
      (state) => ({
        profiles: state.profiles,
        isLoadingProfiles: state.isLoadingProfiles,
        profileError: state.profileError,
        fetchProfiles: state.fetchProfiles,
        updateProfile: state.updateProfile,
        uploadProfilePhoto: state.uploadProfilePhoto,
      })
    )
  );

export const useConnections = () =>
  useAppStore(
    useShallow(
      (state) => ({
        receivedRequests: state.receivedRequests,
        sentRequests: state.sentRequests,
        matches: state.matches,
        feedUsers: state.feedUsers,
        feedPagination: state.feedPagination,
        isLoadingConnections: state.isLoadingConnections,
        connectionError: state.connectionError,
        sendConnectionRequest: state.sendConnectionRequest,
        reviewConnectionRequest: state.reviewConnectionRequest,
        fetchReceivedRequests: state.fetchReceivedRequests,
        fetchSentRequests: state.fetchSentRequests,
        fetchMatches: state.fetchMatches,
        fetchFeedUsers: state.fetchFeedUsers,
        clearConnectionError: state.clearConnectionError,
      })
    )
);

export const useChat = () =>
  useAppStore(
    useShallow(
      (state) => ({
        messages: state.messages,
        activeChat: state.activeChat,
        unreadCount: state.unreadCount,
        isLoadingChat: state.isLoadingChat,
        chatError: state.chatError,
        setActiveChat: state.setActiveChat,
        sendMessage: state.sendMessage,
        fetchMessages: state.fetchMessages,
        addMessage: state.addMessage,
      })
    )
  );

export const usePayment = () =>
  useAppStore(
    useShallow(
      (state) => ({
        paymentHistory: state.paymentHistory,
        isLoadingPayment: state.isLoadingPayment,
        paymentError: state.paymentError,
        createOrder: state.createOrder,
        verifyPayment: state.verifyPayment,
        fetchPaymentHistory: state.fetchPaymentHistory,
      })
    )
  );