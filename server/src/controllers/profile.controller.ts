import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { uploadToS3 } from "../utils/s3.js";
import { calculateProfileStrength } from "../utils/profileStrength.js";

// GET /profile/view
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(401, "User not found!");
    }
    res.status(200).json(new ApiResponse(200, req.user, "Profile fetched successfully"));
});

const ALLOWED_EDIT_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photo",
    "bio",
    "experienceLevel",
    "skills",
    "location",
    "githubUrl",
    "linkedinUrl",
    "twitterUrl",
    "portfolioUrl",
];

const SIMPLE_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "bio",
    "experienceLevel",
    "skills",
    "githubUrl",
    "linkedinUrl",
    "twitterUrl",
    "portfolioUrl",
];

// POST /profile/edit (multipart/form-data)
export const editProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;

    // `skills` / `location` arrive as JSON strings inside the FormData body
    if (typeof req.body.skills === "string") {
        try {
            req.body.skills = JSON.parse(req.body.skills);
        } catch {
            req.body.skills = [req.body.skills];
        }
    }

    if (typeof req.body.location === "string") {
        try {
            req.body.location = JSON.parse(req.body.location);
        } catch {
            throw new ApiError(400, "Invalid location format");
        }
    }

    const requestFields = Object.keys(req.body);
    const hasUnknownField = requestFields.some((field) => !ALLOWED_EDIT_FIELDS.includes(field));
    if (hasUnknownField) {
        throw new ApiError(400, "Invalid edit request: unknown fields");
    }

    if (req.body.location) {
        if (typeof req.body.location !== "object" || !req.body.location.state || !req.body.location.country) {
            throw new ApiError(400, "Location must include both state and country");
        }
    }

    // Photo: uploaded file wins, otherwise an explicit clear ("" / "null") resets to default
    if (req.file) {
        user.photo = await uploadToS3(req.file);
    } else if (req.body.photo === "null" || req.body.photo === "") {
        user.photo = undefined;
    }

    SIMPLE_FIELDS.forEach((field) => {
        if (req.body[field] === undefined) return;
        user.set(field, req.body[field] === "" || req.body[field] === "null" ? undefined : req.body[field]);
    });

    if (req.body.location) {
        user.location = {
            state: req.body.location.state || user.location?.state || "",
            country: req.body.location.country || user.location?.country || "India",
        };
    }

    const { score, isComplete } = calculateProfileStrength(user);
    user.profileCompletion = score;
    user.isProfileComplete = isComplete;

    await user.save();

    res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});
