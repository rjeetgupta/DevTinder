import { z } from "zod";

/**
 * Mirrors the Mongoose User document as returned by the existing backend
 * (`/profile/view`, `/login`, `/signup`, `/user/feed`, `/user/:id`, ...).
 *
 * A few field names intentionally match the backend's existing quirks
 * rather than "corrected" naming, since changing them would break the
 * API contract: `photo` (not `photoUrl`), `bio` (not `about`), and
 * `memberShipType` (capital S — a pre-existing typo in the backend).
 */
export const locationSchema = z.object({
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
});
export type UserLocation = z.infer<typeof locationSchema>;

export const userSchema = z.object({
  _id: z.string(),
  uniqueId: z.string().nullable().optional(),
  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  emailId: z.string().email(),
  age: z.number().nullable().optional(),
  gender: z.string().nullable().optional(),
  photo: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  experienceLevel: z.string().nullable().optional(),
  skills: z.array(z.string()).default([]),
  location: locationSchema.nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  twitterUrl: z.string().nullable().optional(),
  portfolioUrl: z.string().nullable().optional(),
  isPremium: z.boolean().optional(),
  memberShipType: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

/** Looser schema for list endpoints (feed/search) that may omit some fields. */
export const userListSchema = z.array(userSchema);
