import { z } from 'zod';
import axiosInstance from './axios';
import { User } from '@/types/user.types';

// Validation Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().max(50).optional(),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  age: z.number().min(18, 'Must be 18 or older').max(100).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().max(50).optional(),
  age: z.number().min(18).max(100).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  city: z.string().max(100).optional(),
  about: z.string().max(500).optional(),
  skills: z.array(z.string()).max(20).optional(),
  dateOfBirth: z.string().optional(),
});

export const photoUploadSchema = z.object({
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PhotoUploadInput = z.infer<typeof photoUploadSchema>;

// API Functions
class UserAPI {
  // Authentication
  async login(data: unknown) {
    const validatedData = loginSchema.parse(data);
    
    const response = await axiosInstance.post<{
      user: User;
      accessToken: string;
    }>('/auth/login', validatedData);
    
    return response.data;
  }

  async signup(data: unknown) {
    const validatedData = signupSchema.parse(data);
    
    const response = await axiosInstance.post<{
      user: User;
      accessToken: string;
    }>('/auth/register', validatedData);
    
    return response.data;
  }

  async logout() {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  }

  async refreshToken() {
    const response = await axiosInstance.post<{
      accessToken: string;
    }>('/auth/refresh-token');
    
    return response.data;
  }

  // Profile Management
  async getCurrentUser() {
    const response = await axiosInstance.get<User>('/auth/profile');
    return response.data;
  }

  async updateProfile(data: unknown) {
    const validatedData = updateProfileSchema.parse(data);
    
    const response = await axiosInstance.patch<User>('/auth/update-profile', validatedData);
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
    const response = await axiosInstance.get<User[]>('/connections/feed');
    return response.data;
  }

  async getConnections() {
    const response = await axiosInstance.get<User[]>('/connections');
    return response.data;
  }
}

export const userAPI = new UserAPI();