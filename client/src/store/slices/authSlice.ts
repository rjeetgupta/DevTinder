import { StateCreator } from 'zustand';
import { userAPI, LoginInput, SignupInput } from '@/api/user.api';
import { User } from '@/types/user.types';

export interface AuthSlice {
  // State
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (data: LoginInput) => Promise<void>;
  register: (data: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [],
  [],
  AuthSlice
> = (set) => ({
  // Initial state
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login
  login: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await userAPI.login(data);
      
      // Store access token
      localStorage.setItem('accessToken', response.accessToken);
      
      set({
        currentUser: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Signup
  register: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await userAPI.signup(data);
      
      // Store access token
      localStorage.setItem('accessToken', response.accessToken);
      
      set({
        currentUser: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await userAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem('accessToken');
      
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await userAPI.refreshToken();
      localStorage.setItem('accessToken', response.accessToken);
    } catch (error) {
      // If refresh fails, logout user
      localStorage.removeItem('accessToken');
      set({
        currentUser: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
});