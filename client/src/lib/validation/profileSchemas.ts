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

  age: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      return Number(value);
    },
    z
      .number()
      .min(18, { error: "Age must be between 18 and 100" })
      .max(100, { error: "Age must be between 18 and 100" })
      .prefault(18)
  ),

  gender: z.string().optional(),
  experienceLevel: z.string().optional(),

  bio: z
    .string()
    .max(500, { error: "Max 500 characters" })
    .optional()
    .or(z.literal("")),

  skills: z.array(z.string()).optional(),

  location: z.object({
    state: z.string().min(1, { error: "State is required" }).or(z.literal("")),
    country: z.string().optional(),
  }),

  githubUrl: optionalUrl.optional(),
  linkedinUrl: optionalUrl.optional(),
  twitterUrl: optionalUrl.optional(),
  portfolioUrl: optionalUrl.optional(),
});

export type ProfileFormValues = z.infer<typeof editProfileSchema>;
