import { Types } from "mongoose";

// Connection Status Constants
export const CONNECTION_STATUS = {
  INTERESTED: "interested",
  IGNORED: "ignored",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type ConnectionStatusType = typeof CONNECTION_STATUS[keyof typeof CONNECTION_STATUS];

// User Type (populated in connection requests)
export interface IUserPublic {
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  photoUrl: string;
  age?: number;
  gender?: "male" | "female" | "other";
  skills: string[];
  about?: string;
}

// Connection Request Interface
export interface IConnectionRequest {
  _id: Types.ObjectId;
  fromUserId: Types.ObjectId | IUserPublic;
  toUserId: Types.ObjectId | IUserPublic;
  status: ConnectionStatusType;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Type
export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Pagination Type
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  usersPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Feed Response Type
export interface FeedResponse {
  users: IUserPublic[];
  pagination: Pagination;
}