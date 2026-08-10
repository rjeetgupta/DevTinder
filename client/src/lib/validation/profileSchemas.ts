import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url({ error: "Invalid URL" })
  .optional()
  .or(z.literal(""));

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, { error: "Min 2 characters" })
    .max(50, { error: "Max 50 characters" })
    .regex(/^[A-Za-z]+$/, { error: "Letters only" }),

  lastName: z
    .string()
    .regex(/^[A-Za-z]*$/, { error: "Letters only" })
    .optional()
    .or(z.literal("")),

  age: z
    .string()
    .optional()
    .refine((v) => !v || (Number(v) >= 18 && Number(v) <= 100), {
      error: "Age must be between 18 and 100",
    }),

  gender: z.string().optional(),
  experienceLevel: z.string().optional(),

  bio: z
    .string()
    .min(1, { error: "Bio is required" })
    .max(500, { error: "Max 500 characters" }),

  skills: z.array(z.string()).optional(),

  location: z.object({
    state: z.string().min(1, { error: "State is required" }).optional(),
    country: z.string().optional(),
  }),

  githubUrl: optionalUrl.optional(),
  linkedinUrl: optionalUrl.optional(),
  twitterUrl: optionalUrl.optional(),
  portfolioUrl: optionalUrl.optional(),
});

export type ProfileFormValues = z.infer<typeof editProfileSchema>;