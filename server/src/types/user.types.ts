import { Document, Types } from "mongoose";

export interface IUserLocation {
    state?: string;
    country?: string;
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName?: string;
    uniqueId?: string;
    emailId: string;
    password: string;

    emailVerified: boolean;
    lastLoginAt?: Date;
    loginAttempts: number;
    lockUntil?: Date;

    age?: number;
    gender?: "male" | "female" | "others";
    bio?: string;
    experienceLevel?: "fresher" | "junior" | "mid" | "senior";
    location?: IUserLocation;
    photo?: string;
    skills: string[];

    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    portfolioUrl?: string;

    profileCompletion: number;
    isProfileComplete: boolean;
    isBlocked: boolean;
    status: 1 | -1;

    isPremium: boolean;
    memberShipType?: string | null;
    membershipValidTill?: Date | null;

    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;

    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
}

/** Fields safe to expose to other users (feed, search, connections, chat). */
export const PUBLIC_USER_FIELDS =
    "firstName lastName photo age gender bio skills experienceLevel location githubUrl linkedinUrl twitterUrl portfolioUrl isPremium memberShipType emailId";
