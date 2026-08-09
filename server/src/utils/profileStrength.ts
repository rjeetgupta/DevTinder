import { IUser } from "../types/user.types.js";

const DEFAULT_PHOTO =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYCZ0qae7TaC6iuCJf6WzgV97HR0rMLm8N5A&s";

export interface ProfileStrengthResult {
    score: number;
    isComplete: boolean;
}

/**
 * Scores a profile out of 100 across identity (30%), personal details
 * (20%), professional info (30%) and social links (20%). Used to drive
 * `profileCompletion` / `isProfileComplete` on the User model.
 */
export const calculateProfileStrength = (user: Partial<IUser>): ProfileStrengthResult => {
    let score = 0;

    // Core identity
    if (user.firstName && user.lastName) score += 10;
    if (user.photo && user.photo !== DEFAULT_PHOTO) score += 10;
    if (user.emailId) score += 10;

    // Personal details
    if (user.age) score += 5;
    if (user.gender) score += 5;
    if (user.location?.state || user.location?.country) score += 10;

    // Professional info
    if (user.bio && user.bio.length >= 20) score += 10;
    if (user.experienceLevel) score += 10;
    if (Array.isArray(user.skills) && user.skills.length >= 3) score += 10;

    // Social links
    if (user.githubUrl) score += 5;
    if (user.linkedinUrl) score += 5;
    if (user.twitterUrl) score += 5;
    if (user.portfolioUrl) score += 5;

    if (score > 100) score = 100;

    return { score, isComplete: score === 100 };
};
