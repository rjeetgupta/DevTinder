import { z } from "zod";

const optionalUrl = z.string().trim().url("Invalid URL").optional();

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Min 2 characters")
    .max(50, "Max 50 characters")
    .regex(/^[A-Za-z]+$/, "Letters only"),

  lastName: z
    .string()
    .max(50, "Max 50 characters")
    .regex(/^[A-Za-z]*$/, "Letters only")
    .optional(),

  age: z
    .number()
    .min(18, "Age must be between 18 and 100")
    .max(100, "Age must be between 18 and 100")
    .optional(),

  gender: z.string().optional(),
  experienceLevel: z.string().optional(),
  bio: z.string().max(500, "Max 500 characters").optional(),
  skills: z.array(z.string()).optional(),

  location: z.object({
    state: z.string().optional(),
    country: z.string().optional(),
  }),

  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  twitterUrl: optionalUrl,
  portfolioUrl: optionalUrl,
});


export type ProfileFormValues = z.infer<typeof editProfileSchema>;