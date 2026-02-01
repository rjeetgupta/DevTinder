import { z } from 'zod';
import axiosInstance from './axios';
import { ConnectionRequest, User } from '@/types/user.types';

// Validation Schemas
export const sendConnectionSchema = z.object({
  toUserId: z.string().min(1, 'User ID is required'),
  status: z.enum(['interested', 'ignored'], {
    error: 'Status must be either interested or ignored' }),
});

export const reviewConnectionSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  status: z.enum(['accepted', 'rejected'], {
    error: 'Status must be either accepted or rejected' }),
  })

export const feedPaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

// Type exports
export type SendConnectionInput = z.infer<typeof sendConnectionSchema>;
export type ReviewConnectionInput = z.infer<typeof reviewConnectionSchema>;
export type FeedPaginationInput = z.infer<typeof feedPaginationSchema>;

// API Response types
export interface FeedResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    usersPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// API Functions
class ConnectionAPI {
  // Send connection request (interested or ignored)
  async sendConnectionRequest(data: unknown) {
    const validatedData = sendConnectionSchema.parse(data);
    
    const response = await axiosInstance.post<{
      statusCode: number;
      data: ConnectionRequest;
      message: string;
      success: boolean;
    }>(`/connections/request/send/${validatedData.status}/${validatedData.toUserId}`);
    
    return response.data;
  }

  // Review connection request (accept/reject)
  async reviewConnectionRequest(data: unknown) {
    const validatedData = reviewConnectionSchema.parse(data);
    
    const response = await axiosInstance.post<{
      statusCode: number;
      data: ConnectionRequest;
      message: string;
      success: boolean;
    }>(`/connections/request/review/${validatedData.status}/${validatedData.requestId}`);
    
    return response.data;
  }

  // Get received connection requests
  async getReceivedRequests() {
    const response = await axiosInstance.get<{
      statusCode: number;
      data: ConnectionRequest[];
      message: string;
      success: boolean;
    }>('/connections/request/pending');
    
    return response.data.data;
  }

  // Get sent connection requests
  async getSentRequests() {
    const response = await axiosInstance.get<{
      statusCode: number;
      data: ConnectionRequest[];
      message: string;
      success: boolean;
    }>('/connections/request/sent');
    
    return response.data.data;
  }

  // Get all matches (accepted connections)
  async getMatches() {
    const response = await axiosInstance.get<{
      statusCode: number;
      data: ConnectionRequest[];
      message: string;
      success: boolean;
    }>('/connections');
    
    return response.data.data;
  }

  // Get feed users (users you haven't interacted with)
  async getFeedUsers(params?: Partial<FeedPaginationInput>) {
    const validatedParams = feedPaginationSchema.parse(params || {});
    
    const response = await axiosInstance.get<{
      statusCode: number;
      data: FeedResponse;
      message: string;
      success: boolean;
    }>('/connections/feed', {
      params: validatedParams,
    });
    
    return response.data.data;
  }
}

export const connectionAPI = new ConnectionAPI();