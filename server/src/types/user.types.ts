import { Document } from "mongoose";

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

    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}