import { User } from "@/types/user.types";

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  skills?: string[];
  about?: string;
  photoUrl?: string;
}

export interface ProfileState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

