import { apiClient } from "./ApiClient";
import {
  connectionRequestListSchema,
  userListSchema,
  type ConnectionRequest,
  type RequestStatus,
  type User,
} from "@/types";

/**
 * Wraps the "matching" domain: sending/reviewing connection requests,
 * ignored requests, resending, and the accepted-connections list.
 */
export class MatchService {
  async sendRequest(status: Extract<RequestStatus, "interested" | "ignored">, toUserId: string): Promise<void> {
    await apiClient.post(`/request/send/${status}/${toUserId}`);
  }

  async reviewRequest(
    status: Extract<RequestStatus, "accepted" | "rejected">,
    requestId: string
  ): Promise<void> {
    await apiClient.post(`/request/review/${status}/${requestId}`);
  }

  async resendRequest(status: RequestStatus, toUserId: string): Promise<void> {
    await apiClient.post(`/user/resend-request/send/${status}/${toUserId}`);
  }

  async getReceivedRequests(): Promise<ConnectionRequest[]> {
    const res = await apiClient.get("/user/request/received");
    return connectionRequestListSchema.parse(res.data.data ?? res.data);
  }

  async getIgnoredRequests(): Promise<ConnectionRequest[]> {
    const res = await apiClient.get("/user/request/ignored");
    return connectionRequestListSchema.parse(res.data.data ?? res.data);
  }

  async getConnections(): Promise<User[]> {
    const res = await apiClient.get("/user/connections");
    return userListSchema.parse(res.data.data ?? res.data);
  }
}

export const matchService = new MatchService();
