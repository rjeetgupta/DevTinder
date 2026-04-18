import { Document } from "mongoose";

export type MembershipType = "silver" | "gold" | null;

export interface IUser extends Document {
    firstName: string;
    lastName?: string;
    uniqueId: string;

    email: string;
    password: string;

    emailVerified: boolean;
    lastLoginAt?: Date;
    loginAttempts: number;
    lockUntil?: Date;

    age?: number;
    gender?: "male" | "female" | "others";
    bio?: string;
    experienceLevel: "fresher" | "junior" | "mid" | "senior";

    location?: {
        city?: string;
        state?: string;
        country?: string;
    };

    photoUrl: string;

    skills?: string[];

    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    portfolioUrl?: string;

    profileCompletion: number;
    isProfileComplete: boolean;
    isBlocked: boolean;

    status: 1 | -1;
    isPremium: boolean;
    memberShipType: MembershipType;

    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
    refreshToken?: string;

    generateAccessToken: () => string;
    generateRefreshToken: () => string;

    createdAt: Date;
    updatedAt: Date;
}