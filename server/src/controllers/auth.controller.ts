import { Request, Response } from "express";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { sendMail } from "../utils/mailer.js";

const cookieOptions = {
    httpOnly: true,
    secure: false, // must stay false on plain HTTP, even in production
    sameSite: "lax" as const,
};

// Signup
export const signupUser = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, emailId, password, age, gender, photo, skills } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }

    const user = await User.create({
        firstName,
        lastName,
        emailId,
        password,
        age,
        gender,
        photo,
        skills,
    });

    const token = user.generateAuthToken();
    res.cookie("token", token, cookieOptions);

    // Best-effort welcome email — a failed send should not fail signup.
    try {
        await sendMail({
            to: user.emailId,
            subject: "Welcome to DevTinder!",
            text: `Hello ${user.firstName}, Welcome to DevTinder!`,
            html: `<h2>Hello ${user.firstName},</h2><p>Welcome to <b>DevTinder</b> 🚀</p>`,
        });
    } catch (emailError: any) {
        console.error("Welcome email failed:", emailError.message);
    }

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    res.status(201).json(new ApiResponse(201, userResponse, "User created successfully"));
});

// Login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const token = user.generateAuthToken();
    res.cookie("token", token, cookieOptions);

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    res.status(200).json(new ApiResponse(200, userResponse, "Login successful"));
});

// Logout
export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).json(new ApiResponse(200, null, "Logged out"));
});

// Forgot Password — emails a reset link valid for 15 minutes
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { emailId } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
        to: user.emailId,
        subject: "Reset Your Password",
        text: `Click the link to reset your password: ${resetLink}`,
        html: `
            <h2>Password Reset Request</h2>
            <p>Click the button below to reset your password.</p>
            <a href="${resetLink}" style="padding:10px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
            <p>This link is valid for 15 minutes.</p>
        `,
    });

    res.status(200).json(new ApiResponse(200, null, "Password reset link sent to email"));
});

// Reset Password
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const token = req.params.token as string;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});
