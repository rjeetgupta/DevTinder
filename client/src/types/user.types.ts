export interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  isPremium: boolean;
  membershipType?: string;
  membershipValidity?: Date;
  about?: string;
  city?: string;
  photoUrl: string;
  dateOfBirth?: Date;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionRequest {
  _id: string;
  fromUserId: User;
  toUserId: User;
  status: 'ignored' | 'accepted' | 'rejected' | 'interested';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id: string;
  orderId: string;
  paymentId: string;
  userId: string;
  amount: number;
  currency: string;
  notes: {
    firstName?: string;
    lastName?: string;
    membershipType?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}