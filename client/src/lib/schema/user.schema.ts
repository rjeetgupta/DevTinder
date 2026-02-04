import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().max(50).optional(),
    email: z.email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    age: z.number().min(18, "Must be 18 or older").max(100).optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
});

export const updateProfileSchema = z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().max(50).optional(),
    age: z.number().min(18).max(100).optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    city: z.string().max(100).optional(),
    about: z.string().max(500).optional(),
    skills: z.array(z.string()).max(20).optional(),
    dateOfBirth: z.string().optional(),
});

export const photoUploadSchema = z.object({
    photo: z
        .instanceof(File)
        .refine(
            (file) => file.size <= 5 * 1024 * 1024,
            "File size must be less than 5MB",
        )
        .refine(
            (file) =>
                ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
                    file.type,
                ),
            "Only .jpg, .jpeg, .png and .webp formats are supported",
        ),
});

export const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().max(50).optional(),
    age: z.coerce.number().min(18, "Must be 18+").max(100).optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    city: z.string().max(100).optional(),
    about: z.string().max(500).optional(),
    skills: z.array(z.string()).max(20, "Maximum 20 skills allowed"),
});


// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PhotoUploadInput = z.infer<typeof photoUploadSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
