import { z } from "zod";

// SIGNUP
export const signupSchema = z.object({
    body: z.object({
        firstName: z
            .string({ error: "First name is required" })
            .min(4, { error: "First name must be at least 4 characters long" })
            .max(50, { error: "First name must be no longer than 50 characters" })
            .trim(),

        lastName: z.string().trim().optional(),

        emailId: z
            .email({ error: "Invalid email address" })
            .toLowerCase()
            .trim(),

        password: z
            .string({ error: "Password is required" })
            .min(8, { error: "Password must be at least 8 characters" })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?~`])/,
                { error: "Password must contain uppercase, lowercase, a number and a symbol" }
            ),

        age: z
            .number({ error: "Age must be a number" })
            .int({ error: "Age must be a whole number" })
            .min(0)
            .max(120)
            .optional(),

        gender: z.enum(["male", "female", "others"]).optional(),

        photo: z.url({ error: "Invalid photo URL" }).optional(),

        skills: z
            .array(z.string(), { error: "Skills must be an array of strings" })
            .max(25, { error: "Skill count should not exceed 25" })
            .optional(),
    }),
});

// LOGIN
export const loginSchema = z.object({
    body: z.object({
        emailId: z.email({ error: "Invalid email address" }).toLowerCase().trim(),
        password: z.string().min(1, { error: "Password is required" }),
    }),
});

// FORGOT PASSWORD
export const forgotPasswordSchema = z.object({
    body: z.object({
        emailId: z.email({ error: "Invalid email address" }).toLowerCase().trim(),
    }),
});

// RESET PASSWORD
export const resetPasswordSchema = z.object({
    body: z.object({
        password: z
            .string({ error: "Password is required" })
            .min(8, { error: "Password must be at least 8 characters" }),
    }),
    params: z.object({
        token: z.string().min(1, { error: "Reset token is required" }),
    }),
});
