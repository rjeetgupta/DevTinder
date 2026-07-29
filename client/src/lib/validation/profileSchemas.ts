import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Invalid URL")
  .optional()
  .or(z.literal(""));

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "Min 2 characters")
    .max(50, "Max 50 characters")
    .regex(/^[A-Za-z]+$/, "Letters only"),
  lastName: z
    .string()
    .regex(/^[A-Za-z]*$/, "Letters only")
    .optional()
    .or(z.literal("")),
  age: z
    .string()
    .optional()
    .refine((v) => !v || (Number(v) >= 18 && Number(v) <= 100), {
      message: "Age must be between 18 and 100",
    }),
  gender: z.string().optional(),
  experienceLevel: z.string().optional(),
  bio: z.string().min(1, "Bio is required").max(500, "Max 500 characters"),
  skills: z.array(z.string()),
  state: z.string().min(1, "State is required"),
  country: z.string().optional(),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  twitterUrl: optionalUrl,
  portfolioUrl: optionalUrl,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
