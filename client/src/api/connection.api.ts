import axiosInstance from './axios';
import { FeedPaginationInput, feedPaginationSchema, reviewConnectionSchema, sendConnectionSchema } from '@/lib/schema/connection.schema';
import { ApiResponse } from '@/types/api.types';


class ConnectionAPI {
  // Send connection request (interested or ignored)
  async sendConnectionRequest(data: unknown) {
    const validatedData = sendConnectionSchema.parse(data);
    
    const response = await axiosInstance.post<ApiResponse>(`/connections/request/send/${validatedData.status}/${validatedData.toUserId}`);
    
    return response.data;
  }

  // Review connection request (accept/reject)
  async reviewConnectionRequest(data: unknown) {
    const validatedData = reviewConnectionSchema.parse(data);
    
    const response = await axiosInstance.post<ApiResponse>(`/connections/request/review/${validatedData.status}/${validatedData.requestId}`);
    
    return response.data;
  }

  // Get received connection requests
  async getReceivedRequests() {
    const response = await axiosInstance.get<ApiResponse>('/connections/request/pending');
    
    return response.data.data;
  }

  // Get sent connection requests
  async getSentRequests() {
    const response = await axiosInstance.get<ApiResponse>('/connections/request/sent');
    
    return response.data.data;
  }

  // Get all matches (accepted connections)
  async getMatches() {
    const response = await axiosInstance.get<ApiResponse>('/connections');
    
    return response.data.data;
  }

  // Get feed users (users you haven't interacted with)
  async getFeedUsers(params?: Partial<FeedPaginationInput>) {
    const validatedParams = feedPaginationSchema.parse(params || {});
    
    const response = await axiosInstance.get<ApiResponse>('/connections/feed', {
      params: validatedParams,
    });
    
    return response.data.data;
  }
}

export const connectionAPI = new ConnectionAPI();