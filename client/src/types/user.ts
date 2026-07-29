import { z } from "zod";

/**
 * Mirrors the Mongoose User document as returned by the existing backend
 * (`/profile/view`, `/login`, `/signup`, `/user/feed`, `/user/:id`, ...).
 * Kept intentionally permissive on optional fields since the backend
 * returns different projections in different endpoints.
 */
export const userSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  emailId: z.string().email(),
  age: z.number().nullable().optional(),
  gender: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
  skills: z.array(z.string()).default([]),
  country: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  twitterUrl: z.string().nullable().optional(),
  portfolioUrl: z.string().nullable().optional(),
  isPremium: z.boolean().optional(),
  membershipType: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

/** Looser schema for list endpoints (feed/search) that may omit some fields. */
export const userListSchema = z.array(userSchema);
