import { apiClient } from "./ApiClient";

export class AiService {
  async suggestCourses(skills: string[]): Promise<string[]> {
    const res = await apiClient.post("/gemini/suggest-courses", { skills });
    return res.data.data ?? res.data;
  }
}

export const aiService = new AiService();
