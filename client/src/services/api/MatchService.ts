import { apiClient, extractErrorMessage } from "./ApiClient";
import type { ReviewStatus, SendStatus } from "@/types";

/**
 * Wraps the "matching" domain: sending/reviewing connection requests,
 * ignored requests, resending, and the accepted-connections list.
 *
 * No input validation needed — params are ids/enums, not free-form
 * user input. Response returned as-is for Redux Toolkit to shape.
 */
export class MatchService {
  async sendRequest(status: SendStatus, toUserId: string) {
    try {
      const res = await apiClient.post(`/request/send/${status}/${toUserId}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to send request. Please try again."));
    }
  }

  async reviewRequest(status: ReviewStatus, requestId: string) {
    try {
      const res = await apiClient.post(`/request/review/${status}/${requestId}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to review request. Please try again."));
    }
  }

  async resendRequest(status: SendStatus, toUserId: string) {
    try {
      const res = await apiClient.post(`/user/resend-request/send/${status}/${toUserId}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to resend request. Please try again."));
    }
  }

  async getReceivedRequests() {
    try {
      const res = await apiClient.get("/user/request/received");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load received requests."));
    }
  }

  async getIgnoredRequests() {
    try {
      const res = await apiClient.post("/user/request/ignored");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load ignored requests."));
    }
  }

  async getConnections() {
    try {
      const res = await apiClient.get("/user/connections");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to load your connections."));
    }
  }
}

export const matchService = new MatchService();