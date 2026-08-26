import { Request, Response } from "express";
import ConnectionRequestModel from "../models/connection.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { CONNECTION_STATUS } from "../constant/connection.status.js";

/**
 * POST /request/send/:status/:toUserId
 * status is "intrested" (send interest) or "ignored" (hide from my feed)
 */
export const sendConnectionRequest = asyncHandler(async (req: Request, res: Response) => {
    const fromUserId = req.user!._id;
    const toUserId = req.params.toUserId as string;
    const status = req.params.status as string;

    const allowedStatus: string[] = [CONNECTION_STATUS.INTERESTED, CONNECTION_STATUS.IGNORED];
    if (!allowedStatus.includes(status)) {
        throw new ApiError(400, `Invalid status type: ${status}`);
    }

    if (fromUserId.toString() === toUserId) {
        throw new ApiError(400, "You cannot send a connection request to yourself");
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
        throw new ApiError(404, "User not found!");
    }

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
        ],
    });

    if (existingConnectionRequest) {
        throw new ApiError(400, "Connection request already exists!");
    }

    const connectionRequest = await ConnectionRequestModel.create({ fromUserId, toUserId, status });

    res.status(201).json(
        new ApiResponse(201, connectionRequest, `${req.user!.firstName} is ${status} in ${toUser.firstName}`)
    );
});

/**
 * POST /request/review/:status/:requestId
 * status is "accepeted" or "rejected"
 */
export const reviewConnectionRequest = asyncHandler(async (req: Request, res: Response) => {
    const loggedInUser = req.user!;
    const requestId = req.params.requestId as string;
    const status = req.params.status as string;

    console.log("Request body : ", req.body)
    console.log("Params body : ", req.params)

    const allowedStatus: string[] = [CONNECTION_STATUS.ACCEPTED, CONNECTION_STATUS.REJECTED];
    if (!allowedStatus.includes(status)) {
        throw new ApiError(400, "Status not allowed!");
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: CONNECTION_STATUS.INTERESTED,
    });

    if (!connectionRequest) {
        throw new ApiError(404, "Connection request not found!");
    }

    connectionRequest.status = status as typeof CONNECTION_STATUS.ACCEPTED;
    const data = await connectionRequest.save();

    res.status(200).json(new ApiResponse(200, data, `Connection request ${status}`));
});

/**
 * GET /user/is-connected/:targetUserId
 * Premium users are always treated as "connected" (they can message anyone).
 */
export const checkIsConnected = asyncHandler(async (req: Request, res: Response) => {
    const loggedInUserId = req.user!._id;
    const { targetUserId } = req.params;

    if (req.user!.isPremium) {
        return res.json({ success: true, isConnected: true });
    }

    const connection = await ConnectionRequestModel.findOne({
        status: CONNECTION_STATUS.ACCEPTED,
        $or: [
            { fromUserId: loggedInUserId, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: loggedInUserId },
        ],
    });

    return res.json({ success: true, isConnected: !!connection });
});
