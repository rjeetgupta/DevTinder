export interface ProfileStrengthResult {
    score: number;
    isComplete: boolean;
}

export interface UserLocation {
    state?: string;
    country?: string;
}

export interface ProfileStrengthUser {
    firstName?: string;
    lastName?: string;
    photo?: string;
    emailId?: string;
    age?: number;
    gender?: string;
    location?: UserLocation;
    bio?: string;
    experienceLevel?: string;
    skills?: string[];
    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    portfolioUrl?: string;
}

/**
 * Default placeholder image URL.
 * If the user's photo matches this value, it does not contribute to profile strength.
 */
const DEFAULT_PHOTO_URL =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYCZ0qae7TaC6iuCJf6WzgV97HR0rMLm8N5A&s";

/**
 * Calculates a user's profile strength score based on identity,
 * personal details, professional details, and social links.
 *
 * Scoring breakdown:
 * - Core Identity: 30
 * - Personal Details: 20
 * - Professional Info: 30
 * - Social Links: 20
 *
 * @param user - User object containing profile fields
 * @returns Profile strength score and completion flag
 */

export const calculateProfileStrength = (
    user: ProfileStrengthUser
): ProfileStrengthResult => {
    let score = 0;

    // --- Core Identity (30%) ---
    if (user.firstName && user.lastName) score += 10;

    // Check if photo exists and is not the default placeholder
    if (user.photo && user.photo !== DEFAULT_PHOTO_URL) {
        score += 10;
    }

    // Assuming email presence is enough for now
    if (user.emailId) score += 10;

    // --- Personal Details (20%) ---
    if (user.age) score += 5;
    if (user.gender) score += 5;
    if (user.location?.state || user.location?.country) score += 10;

    // --- Professional Info (30%) ---
    if (user.bio && user.bio.length >= 20) score += 10;
    if (user.experienceLevel) score += 10;
    if (Array.isArray(user.skills) && user.skills.length >= 3) score += 10;

    // --- Social Links (20%) ---
    let socialScore = 0;
    if (user.githubUrl) socialScore += 5;
    if (user.linkedinUrl) socialScore += 5;
    if (user.twitterUrl) socialScore += 5;
    if (user.portfolioUrl) socialScore += 5;

    score += socialScore;

    // Cap score at 100 just in case
    if (score > 100) score = 100;

    return {
        score,
        isComplete: score === 100,
    };
};