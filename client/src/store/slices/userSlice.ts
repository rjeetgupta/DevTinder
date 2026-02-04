import { StateCreator } from 'zustand';
import { userAPI, UpdateProfileInput } from '@/api/user.api';
import { User } from '@/types/user.types';

export interface UserSlice {
  // State
  profiles: User[];
  isLoadingProfiles: boolean;
  profileError: string | null;
  currentUser: User | null;

  // Actions
  fetchCurrentUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
  uploadProfilePhoto: (file: File) => Promise<void>;
  fetchProfiles: () => Promise<void>;
  clearProfileError: () => void;
}

export const createUserSlice: StateCreator<
  UserSlice,
  [],
  [],
  UserSlice
> = (set, get) => ({
  // Initial state
  profiles: [],
  isLoadingProfiles: false,
  profileError: null,
  currentUser: null,

  // Fetch current user
  fetchCurrentUser: async () => {
    try {
      const user = await userAPI.getCurrentUser();
      
      // Update user in auth slice (if you have access to other slices)
      // For now, just return the user
      set({ currentUser: user.data })
      return user as any;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user';
      set({ profileError: errorMessage });
      throw error;
    }
  },

  // Update profile
  updateProfile: async (data) => {
    set({ isLoadingProfiles: true, profileError: null });
    
    try {
      const updatedUser = await userAPI.updateProfile(data);
      
      // Update current user (this would need to update auth slice)
      // You'll handle this in the combined store
      
      set({ isLoadingProfiles: false });
      return updatedUser as any;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      set({
        isLoadingProfiles: false,
        profileError: errorMessage,
      });
      throw error;
    }
  },

  // Upload profile photo
  uploadProfilePhoto: async (file) => {
    set({ isLoadingProfiles: true, profileError: null });
    
    try {
      const response = await userAPI.uploadProfilePhoto({ photo: file });
      
      // Update photo URL in current user
      // This would need to update auth slice
      
      set({ isLoadingProfiles: false });
      return response.photoUrl as any;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload photo';
      set({
        isLoadingProfiles: false,
        profileError: errorMessage,
      });
      throw error;
    }
  },

  // Fetch profiles for swiping
  fetchProfiles: async () => {
    set({ isLoadingProfiles: true, profileError: null });
    
    try {
      const profiles = await userAPI.getFeed();
      
      set({
        profiles,
        isLoadingProfiles: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profiles';
      set({
        isLoadingProfiles: false,
        profileError: errorMessage,
      });
      throw error;
    }
  },

  // Clear error
  clearProfileError: () => set({ profileError: null }),
});