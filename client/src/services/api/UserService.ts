import { apiClient } from "./ApiClient";
import { userSchema, userListSchema, type User, type UserLocation } from "@/types";

export interface EditProfilePayload {
  firstName: string;
  lastName?: string;
  age?: number | null;
  gender?: string | null;
  bio: string;
  experienceLevel?: string | null;
  skills?: string[];
  location?: UserLocation;
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

    formData.append("firstName", payload.firstName);
    if (payload.lastName) formData.append("lastName", payload.lastName);
    if (payload.age) formData.append("age", String(payload.age));
    if (payload.gender) formData.append("gender", payload.gender);
    formData.append("bio", payload.bio);
    if (payload.experienceLevel) formData.append("experienceLevel", payload.experienceLevel);

    // Backend expects these two JSON-stringified, matching the original client.
    formData.append("skills", JSON.stringify(payload.skills ?? []));
    if (payload.location) {
      formData.append("location", JSON.stringify(payload.location));
    }

    if (payload.githubUrl) formData.append("githubUrl", payload.githubUrl);
    if (payload.linkedinUrl) formData.append("linkedinUrl", payload.linkedinUrl);
    if (payload.twitterUrl) formData.append("twitterUrl", payload.twitterUrl);
    if (payload.portfolioUrl) formData.append("portfolioUrl", payload.portfolioUrl);

    if (payload.photo instanceof File) {
      formData.append("photo", payload.photo);
    }

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
    return Boolean(res.data.isConnected);
  }
}

export const userService = new UserService();
