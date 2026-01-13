import { Request, Response } from "express";
import { ConnectionRequest } from "../models/connection.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { CONNECTION_STATUS } from "../constant/connection.status.js";

const PUBLIC_USE_DATA = "firstName lastName photoUrl age gender skills about";

/**
 * Send Connection Request
 * POST /connections/request/send/:status/:toUserId
 * Purpose: Send "interested" or mark as "ignored"
 */
const sendConnectionRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const fromUserId = req.user?._id;
    const { toUserId, status } = req.params;

    if (!fromUserId) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Validate status
    const allowedStatus = [CONNECTION_STATUS.INTERESTED, CONNECTION_STATUS.IGNORED];
    if (!allowedStatus.includes(status as any)) {
      throw new ApiError(400, `Invalid status type: ${status}`);
    }

    // Prevent self-connection
    if (fromUserId.toString() === toUserId) {
      throw new ApiError(400, "You cannot send a connection request to yourself");
    }

    // Check if toUserId exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new ApiError(404, "User not found");
    }

    // Check if connection already exists (bidirectional)
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      throw new ApiError(
        400,
        `Connection request already exists with status: ${existingConnectionRequest.status}`
      );
    }

    // Create new connection request
    const sentConnectionReq = await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status,
    });

    const message =
      status === CONNECTION_STATUS.INTERESTED
        ? "Connection request sent successfully"
        : "User ignored successfully";

    return res.status(201).json(
      new ApiResponse(201, sentConnectionReq, message)
    );
  }
);

/**
 * Review Connection Request
 * POST /connections/request/review/:status/:requestId
 * Purpose: Accept or reject a pending request
 */
const reviewConnectionRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUser = req.user;
    const { requestId, status } = req.params;

    if (!loggedInUser?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Validate status
    const allowedStatus = [
      CONNECTION_STATUS.ACCEPTED,
      CONNECTION_STATUS.REJECTED,
    ];

    if (!allowedStatus.includes(status as any)) {
      throw new ApiError(400, `Invalid status type: ${status}`);
    }

    // Find the connection request
    // IMPORTANT: Only requests sent TO you with status "interested"
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: CONNECTION_STATUS.INTERESTED,
    });

    if (!connectionRequest) {
      throw new ApiError(
        404,
        "Connection request not found or you are not authorized to review it"
      );
    }

    // Update status
    connectionRequest.status = status as typeof CONNECTION_STATUS.ACCEPTED;
    const updatedRequest = await connectionRequest.save();

    // Populate both users
    await updatedRequest.populate("fromUserId", PUBLIC_USE_DATA);
    await updatedRequest.populate("toUserId", PUBLIC_USE_DATA);

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedRequest,
        `Connection request ${status.toLowerCase()} successfully`
      )
    );
  }
);

/**
 * Get Pending Requests (Received)
 * GET /connections/request/pending
 * Purpose: Get all requests sent TO you that are pending (status: "interested")
 */
const findAllConnectionRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUser = req.user;

    if (!loggedInUser?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Find requests where YOU are the receiver (toUserId)
    // and status is "interested" (pending)
    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: CONNECTION_STATUS.INTERESTED,
    })
      .populate("fromUserId", PUBLIC_USE_DATA)
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          requests: pendingRequests,
          count: pendingRequests.length,
        },
        pendingRequests.length > 0
          ? "Pending connection requests fetched successfully"
          : "No pending connection requests"
      )
    );
  }
);

/**
 * Get All Connections (Accepted)
 * GET /connections
 * Purpose: Get all accepted connections (where you're either sender or receiver)
 */
const findAllConnectedUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUser = req.user;

    if (!loggedInUser?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Find all accepted connections where you're involved
    const allConnectedRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: CONNECTION_STATUS.ACCEPTED },
        { fromUserId: loggedInUser._id, status: CONNECTION_STATUS.ACCEPTED },
      ],
    })
      .populate("fromUserId", PUBLIC_USE_DATA)
      .populate("toUserId", PUBLIC_USE_DATA)
      .sort({ updatedAt: -1 });

    // Extract the OTHER user (not the logged-in user)
    // FIXED: Check the populated documents, not just IDs
    const allConnections = allConnectedRequests.map((row) => {
      // If I am the sender (fromUserId), return the receiver (toUserId)
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      // If I am the receiver (toUserId), return the sender (fromUserId)
      return row.fromUserId;
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          connections: allConnections,
          count: allConnections.length,
        },
        allConnections.length > 0
          ? "Connections fetched successfully"
          : "No connections found"
      )
    );
  }
);

/**
 * Get Feed Users
 * GET /connections/feed
 * Purpose: Get users you haven't interacted with yet
 */
const findAllUsersForFeed = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUser = req.user!;

    if (!loggedInUser?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Parse pagination
    const page = Math.max(
      1,
      typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1
    );

    let limit = Math.max(
      1,
      typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 10
    );

    limit = Math.min(limit, 50);
    const skip = (page - 1) * limit;

    // Find all connection requests involving you
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    // Build set of user IDs to hide
    const hideUserFromFeed = new Set<string>();

    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    // Also hide yourself
    hideUserFromFeed.add(loggedInUser._id.toString());

    // Count total available users
    const totalUsers = await User.countDocuments({
      _id: { $nin: Array.from(hideUserFromFeed) },
    });

    // Fetch users
    const users = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) },
    })
      .select(PUBLIC_USE_DATA)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Calculate pagination
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          users,
          pagination: {
            currentPage: page,
            totalPages,
            totalUsers,
            usersPerPage: limit,
            hasNextPage,
            hasPrevPage,
          },
        },
        users.length > 0
          ? "Feed users fetched successfully"
          : "No more users available"
      )
    );
  }
);

export {
  sendConnectionRequest,
  reviewConnectionRequest,
  findAllConnectionRequests,
  findAllConnectedUsers,
  findAllUsersForFeed,
};