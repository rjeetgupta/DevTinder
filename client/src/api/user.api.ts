import axiosInstance from './axios';
import { ApiResponse } from '@/types/user.types';
import {
  loginSchema,
  photoUploadSchema,
  registerSchema,
  updateProfileSchema
} from '@/lib/schema/user.schema';


class UserAPI {

  async login(data: unknown) {
    const validatedData = loginSchema.parse(data);
    
    const response = await axiosInstance.post<ApiResponse>('/auth/login', validatedData);
    
    return response.data;
  }

  async signup(data: unknown) {
    const validatedData = registerSchema.parse(data);
    
    const response = await axiosInstance.post<ApiResponse>('/auth/register', validatedData);
    
    return response.data;
  }

  async logout() {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  }

  async refreshToken() {
    const response = await axiosInstance.post<ApiResponse>('/auth/refresh-token');
    
    return response.data;
  }

  // Profile Management
  async getCurrentUser() {
    const response = await axiosInstance.get<ApiResponse>('/auth/profile');
    return response.data;
  }

  async updateProfile(data: unknown) {
    const validatedData = updateProfileSchema.parse(data);
    
    const response = await axiosInstance.patch<ApiResponse>('/auth/update-profile', validatedData);
    return response.data;
  }

  async uploadProfilePhoto(data: unknown) {
    const validatedData = photoUploadSchema.parse(data);
    
    const formData = new FormData();
    formData.append('photo', validatedData.photo);
    
    const response = await axiosInstance.post<{
      photoUrl: string;
    }>('/user/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  // Feed
  async getFeed() {
    const response = await axiosInstance.get<ApiResponse>('/connections/feed');
    return response.data;
  }

  async getConnections() {
    const response = await axiosInstance.get<ApiResponse>('/connections');
    return response.data;
  }
}

export const userAPI = new UserAPI();