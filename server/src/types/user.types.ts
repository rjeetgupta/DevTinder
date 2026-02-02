import { Document } from "mongoose";
import { SubscriptionTier } from "../utils/constant";

export interface IUser extends Document {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    city?: string;
    photoUrl?: string;
    dateOfBirth?: Date;
    about?: string;
    skills?: string[];
    refreshToken?: string;

    isPremium: boolean;
    subscriptionTier: SubscriptionTier;
    membershipValidity?: Date | null;
    isProfileVerified?: boolean;

    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}