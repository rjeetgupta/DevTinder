import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { Types } from "mongoose";

// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Helper function to generate tokens
const generateTokens = async (userId: Types.ObjectId | string) => {
    const user = await User.findById(userId).select("+refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

// Register User
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, age, gender, skills, about } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        age,
        gender,
        skills,
        about,
    });

    res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});

// Login User
const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, "User with this email does not exist");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { loggedInUser, accessToken, refreshToken },
                "Logged in successfully"
            ));
});

// Logout User
const logoutUser = asyncHandler(async (req: Request, res: Response) => {

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: "" } }, { new: true });

    res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, null, "Logged out successfully"));
});

// Get Current User
const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    res.status(200).json(new ApiResponse(200, user, "Profile fetched successfully"));
});

// Change Password
const changeUserPassword = asyncHandler(async (req: Request, res: Response) => {

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const { oldPassword, newPassword } = req.body;

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json(new ApiResponse(200, null, "Password updated successfully"));
});

// Update User Details
const updateUserDetails = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const updates = req.body;
    const restrictedFields = ["password", "refreshToken", "email"];
    restrictedFields.forEach((field) => delete updates[field]);

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).select("-password");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { _id: string };

        const user = await User.findById(decoded._id).select("+refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } = await generateTokens(user._id);

        res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed successfully"));
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changeUserPassword,
    refreshAccessToken,
    updateUserDetails,
}