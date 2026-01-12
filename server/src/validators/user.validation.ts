import { z } from "zod";

// REGISTER SCHEMA
export const registerSchema = z.object({
    body: z.object({
        firstName: z
            .string()
            .min(1, { error: "First name is required" })
            .max(20, { error: "First name cannot exceed 20 characters" })
            .trim(),

        lastName: z
            .string()
            .max(20, { error: "Last name cannot exceed 20 characters" })
            .trim()
            .optional(),

        email: z
            .email({ error: "Email is required" })
            .toLowerCase()
            .trim(),

        password: z
            .string({ error: "Password is required" })
            .min(8, { error: "Password must be at least 8 characters" })
            .max(100, { error: "Password cannot exceed 100 characters" })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                { error: "Password must contain uppercase, lowercase, number, and special character" }
            ),

        age: z
            .number({ error: "Age must be a number" })
            .int({ error: "Age must be an integer" })
            .min(18, { error: "Age must be at least 18" })
            .max(90, { error: "Age must be less than 90" })
            .optional(),

        gender: z.enum(["male", "female", "other"]).optional(),

        skills: z.array(z.string()).default([]),

        about: z.string().default("No about section provided"),
    })
});


// LOGIN SCHEMA
export const loginSchema = z.object({
    body: z.object({
        email: z
            .email({ error: "Invalid email address" })
            .toLowerCase()
            .trim(),

        password: z
            .string()
            .min(4, { error: "Password cannot be empty" }),

    })
});


// CHANGE PASSWORD
export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z
            .string()
            .min(1, { error: "Old password is required" }),

        newPassword: z
            .string()
            .min(8, { error: "Password must be at least 8 characters" })
            .max(50, { error: "Password cannot exceed 100 characters" })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                { error: "Password must contain uppercase, lowercase, number, and special character" }
            ),
    })
        .refine((data) => data.oldPassword !== data.newPassword, {
            error: "New password must be different from old password",
            path: ["newPassword"],

        })
});


// UPDATE PROFILE
export const updateProfileSchema = z.object({
    body: z.object({
        firstName: z
            .string()
            .min(1, { error: "First name cannot be empty" })
            .max(50, { error: "First name cannot exceed 50 characters" })
            .trim()
            .optional(),

        lastName: z
            .string()
            .max(50, { error: "Last name cannot exceed 50 characters" })
            .trim()
            .optional(),

        age: z
            .number()
            .int({ error: "Age must be an integer" })
            .min(18, { error: "Age must be at least 18" })
            .max(120, { error: "Age must be less than 120" })
            .optional(),

        gender: z.enum(["male", "female", "other"]).optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
            error: "At least one field must be provided for update",

        })
});
