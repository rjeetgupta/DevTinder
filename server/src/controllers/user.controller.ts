import { Request, Response } from "express";
import mongoose from "mongoose";
import ConnectionRequestModel from "../models/connection.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { CONNECTION_STATUS } from "../constant/connection.status.js";
import { PUBLIC_USER_FIELDS } from "../types/user.types.js";
import { skillList, popularSkillIds } from "../utils/constant.js";

/**
 * GET /user/request/received
 * Pending "intrested" requests sent TO the logged-in user.
 */
export const getReceivedRequests = asyncHandler(async (req: Request, res: Response) => {
    const requests = await ConnectionRequestModel.find({
        toUserId: req.user!._id,
        status: CONNECTION_STATUS.INTERESTED,
    }).populate("fromUserId", PUBLIC_USER_FIELDS);

    res.status(200).json(new ApiResponse(200, requests, "Received requests fetched successfully"));
});

/**
 * GET /user/connections
 * All accepted connections, returning the *other* user in each pair.
 */
export const getConnections = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const connections = await ConnectionRequestModel.find({
        status: CONNECTION_STATUS.ACCEPTED,
        $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
        .populate("fromUserId", PUBLIC_USER_FIELDS)
        .populate("toUserId", PUBLIC_USER_FIELDS);

    const data = connections.map((connection) =>
        (connection.fromUserId as any)._id.toString() === userId.toString()
            ? connection.toUserId
            : connection.fromUserId
    );

    res.status(200).json(new ApiResponse(200, data, "Connections fetched successfully"));
});

/**
 * POST /user/feed
 * Users not yet interacted with, paginated, premium/complete profiles surfaced first.
 */
export const getFeedUsers = asyncHandler(async (req: Request, res: Response) => {
    const loggedInUser = req.user!;

    const page = Math.max(parseInt(req.body.page) || 1, 1);
    const limit = Math.min(parseInt(req.body.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const interactions = await ConnectionRequestModel.find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hiddenIdsSet = new Set<string>();
    interactions.forEach((interaction) => {
        hiddenIdsSet.add(interaction.fromUserId.toString());
        hiddenIdsSet.add(interaction.toUserId.toString());
    });
    hiddenIdsSet.add(loggedInUser._id.toString());

    const hiddenObjectIds = Array.from(hiddenIdsSet).map((id) => new mongoose.Types.ObjectId(id));

    const users = await User.find({
        _id: { $nin: hiddenObjectIds },
        status: 1,
        isBlocked: false,
    })
        .select(PUBLIC_USER_FIELDS)
        .sort({ isPremium: -1, isProfileComplete: -1, _id: 1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json(new ApiResponse(200, users, "Feed users fetched successfully"));
});

/**
 * GET /user/suggested-skills
 * Popular skills the user hasn't already listed on their profile.
 */
export const getSuggestedSkills = asyncHandler(async (req: Request, res: Response) => {
    const userSkillIds = req.user!.skills || [];

    const relevantIds = popularSkillIds.filter((id) => !userSkillIds.includes(id));

    const suggestions = relevantIds
        .map((id) => skillList.find((skill) => skill.id === id))
        .filter(Boolean)
        .slice(0, 5);

    res.status(200).json(new ApiResponse(200, suggestions, "Suggested skills fetched successfully"));
});

/**
 * GET /user/:id
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(id).select(PUBLIC_USER_FIELDS);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

/**
 * GET /user/search?q=...
 */
export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
    const query = (req.query.q as string) || "";
    const loggedInUserId = req.user!._id;

    const searchText = query.trim();
    if (!searchText) {
        throw new ApiError(400, "Please provide a valid search query");
    }

    const results = await User.find({
        $or: [
            { firstName: { $regex: searchText, $options: "i" } },
            { lastName: { $regex: searchText, $options: "i" } },
            { skills: { $regex: searchText, $options: "i" } },
        ],
        _id: { $ne: loggedInUserId },
        status: 1,
        isBlocked: false,
    })
        .select(PUBLIC_USER_FIELDS)
        .limit(10);

    res.status(200).json(new ApiResponse(200, results, "Search completed successfully"));
});

/**
 * POST /user/request/ignored — premium-only: users I swiped past.
 */
export const getIgnoredRequests = asyncHandler(async (req: Request, res: Response) => {
    const loggedInUser = req.user!;

    if (!loggedInUser.isPremium) {
        throw new ApiError(403, "Access denied. Premium feature.");
    }

    const ignoredRequests = await ConnectionRequestModel.find({
        fromUserId: loggedInUser._id,
        status: CONNECTION_STATUS.IGNORED,
    })
        .populate("toUserId", PUBLIC_USER_FIELDS)
        .sort({ createdAt: -1 });

    const data = ignoredRequests.map((row) => row.toUserId);

    res.status(200).json(new ApiResponse(200, data, "Ignored users fetched successfully"));
});

/**
 * POST /user/resend-request/send/:status/:toUserId
 * "Rewind": clears a prior ignore before sending fresh interest.
 */
export const resendConnectionRequest = asyncHandler(async (req: Request, res: Response) => {
    const fromUserId = req.user!._id;
    const toUserId = req.params.toUserId as string;
    const status = req.params.status as string;

    const allowedStatus: string[] = [CONNECTION_STATUS.INTERESTED, CONNECTION_STATUS.IGNORED];
    if (!allowedStatus.includes(status)) {
        throw new ApiError(400, `Invalid status type: ${status}`);
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
        throw new ApiError(404, "User not found!");
    }

    await ConnectionRequestModel.findOneAndDelete({
        fromUserId,
        toUserId,
        status: CONNECTION_STATUS.IGNORED,
    });

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
        ],
    });

    if (existingConnectionRequest) {
        throw new ApiError(400, "Connection request already exists (or they already sent you one)!");
    }

    const connectionRequest = await ConnectionRequestModel.create({ fromUserId, toUserId, status });

    res.status(200).json(
        new ApiResponse(200, connectionRequest, `${req.user!.firstName} is ${status} in ${toUser.firstName}`)
    );
});
