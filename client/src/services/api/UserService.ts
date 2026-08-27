import { apiClient, extractErrorMessage } from "./ApiClient";
import type { UserLocation } from "@/types";
// TODO: point this at your real schema — placeholder based on
// EditProfilePayload shape. Replace once confirmed. Note: the schema
// should validate the plain fields only; `photo` (a File) is appended
// to FormData separately below and isn't something Zod validates here
// (do file-type/size checks at the input `<input type="file">` layer
// if not already done there).
import { editProfileSchema } from "@/lib/validation/profileSchemas";

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
  async getProfile() {
    try {
      const res = await apiClient.get("/profile");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load your profile."));
    }
  }

  async editProfile(payload: EditProfilePayload) {
    const { photo, ...validatable } = payload;
    const parsed = editProfileSchema.safeParse(validatable);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? "Please check your input.");
    }

    const formData = new FormData();
    const data = parsed.data;

    formData.append("firstName", data.firstName);
    if (data.lastName) formData.append("lastName", data.lastName);
    if (data.age) formData.append("age", String(data.age));
    if (data.gender) formData.append("gender", data.gender);
    formData.append("bio", data.bio);
    if (data.experienceLevel) formData.append("experienceLevel", data.experienceLevel);

    // Backend expects these two JSON-stringified, matching the original client.
    formData.append("skills", JSON.stringify(data.skills ?? []));
    if (data.location) {
      formData.append("location", JSON.stringify(data.location));
    }

    if (data.githubUrl) formData.append("githubUrl", data.githubUrl);
    if (data.linkedinUrl) formData.append("linkedinUrl", data.linkedinUrl);
    if (data.twitterUrl) formData.append("twitterUrl", data.twitterUrl);
    if (data.portfolioUrl) formData.append("portfolioUrl", data.portfolioUrl);

    if (photo instanceof File) {
      formData.append("photo", photo);
    }

    try {
      const res = await apiClient.post("/profile/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to save profile. Please try again."));
    }
  }

  async getFeed(page = 1, limit = 10) {
    try {
      const res = await apiClient.post("/user/feed", { page, limit });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load your feed."));
    }
  }

  async getUserById(userId: string) {
    try {
      const res = await apiClient.get(`/user/${userId}`);
      return res.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load this user."));
    }
  }

  async searchUsers(query: string) {
    try {
      const res = await apiClient.get("/user/search", { params: { q: query } });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to search users. Please try again."));
    }
  }

  async getSuggestedSkills() {
    try {
      const res = await apiClient.get("/user/suggested-skills");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load suggested skills."));
    }
  }

  async isConnected(targetUserId: string) {
    try {
      const res = await apiClient.get(`/user/is-connected/${targetUserId}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to check connection status."));
    }
  }
}

export const userService = new UserService();