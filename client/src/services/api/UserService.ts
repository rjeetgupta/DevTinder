import { apiClient } from "./ApiClient";
import { userSchema, userListSchema, type User } from "@/types";

export interface EditProfilePayload {
  firstName: string;
  lastName?: string;
  age?: number | null;
  gender?: string | null;
  about?: string | null;
  skills?: string[];
  photo?: File;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  portfolioUrl?: string | null;
}

/**
 * Wraps profile + user-discovery endpoints: viewing/editing your own
 * profile, the swipe feed, search, and looking up other users by id.
 */
export class UserService {
  async getProfile(): Promise<User> {
    const res = await apiClient.get("/profile/view");
    return userSchema.parse(res.data.data ?? res.data);
  }

  async editProfile(payload: EditProfilePayload): Promise<User> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === "photo" && value instanceof File) {
        formData.append("photo", value);
      } else if (key === "skills" && Array.isArray(value)) {
        value.forEach((skill) => formData.append("skills", skill));
      } else {
        formData.append(key, String(value));
      }
    });

    const res = await apiClient.post("/profile/edit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return userSchema.parse(res.data.data ?? res.data);
  }

  async getFeed(): Promise<User[]> {
    const res = await apiClient.get("/user/feed");
    return userListSchema.parse(res.data.data ?? res.data);
  }

  async getUserById(userId: string): Promise<User> {
    const res = await apiClient.get(`/user/${userId}`);
    return userSchema.parse(res.data.data ?? res.data);
  }

  async searchUsers(query: string): Promise<User[]> {
    const res = await apiClient.get("/user/search", { params: { q: query } });
    return userListSchema.parse(res.data.data ?? res.data);
  }

  async getSuggestedSkills(): Promise<string[]> {
    const res = await apiClient.get("/user/suggested-skills");
    return res.data.data ?? res.data;
  }

  async isConnected(targetUserId: string): Promise<boolean> {
    const res = await apiClient.get(`/user/is-connected/${targetUserId}`);
    return Boolean(res.data.data ?? res.data);
  }
}

export const userService = new UserService();
