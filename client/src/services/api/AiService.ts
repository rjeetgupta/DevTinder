import { apiClient, extractErrorMessage } from "./ApiClient";

export class AiService {
  async suggestCourses(skills: string[]) {
    try {
      const res = await apiClient.post("/gemini/suggest-courses", { skills });
      return res.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Unable to load course suggestions. Please try again.")
      );
    }
  }
}

export const aiService = new AiService();