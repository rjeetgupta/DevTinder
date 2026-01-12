// import { Request, Response } from "express";
// import { ConnectionRequest } from "../models/connection.model.js";
// import asyncHandler from "../utils/asyncHandler.js";
// import ApiResponse from "../utils/ApiResponse.js";
// import ApiError from "../utils/ApiError.js";
// import User from "../models/user.model.js";
// import mongoose from "mongoose";
// import { CONNECTION_STATUS } from "../constant/connection.status.js";

// const PUBLIC_USE_DATA = "firstName lastName photoUrl age gender skills about";

// const sendConnectionRequest = asyncHandler(
// 	async (req: Request, res: Response) => {
// 		const fromUserId = req.user?._id;
// 		const toUserId = req.params.toUserId;
// 		const status = req.params.status;

// 		const allowedStatus = ["interested", "ignored"];
// 		if (!allowedStatus.includes(status)) {
// 			throw new ApiError(400, "Invalid status type " + status);
// 		}

// 		// Check toUserId is in my DB or not
// 		const toUser = await User.findById(toUserId);
// 		if (!toUser) {
// 			throw new ApiError(404, "User does not exist");
// 		}

// 		// Check if already user A send the connection request to user B or vic-versa send to user or not.
// 		const existingConnectionRequest = await ConnectionRequest.findOne({
// 			$or: [
// 				{ fromUserId, toUserId },
// 				{ fromUserId: toUserId, toUserId: fromUserId },
// 			],
// 		});

// 		if (existingConnectionRequest) {
// 			throw new ApiError(400, "Connection request already exit");
// 		}

// 		const sentConnectionReq = await ConnectionRequest.create({
// 			fromUserId,
// 			toUserId,
// 			status,
// 		});

// 		// TODO: Change the msg dynamically
// 		return res
// 			.status(200)
// 			.json(
// 				new ApiResponse(
// 					200,
// 					{ sentConnectionReq },
// 					"Connection Request send Successfully"
// 				)
// 			);
// 	}
// );

// const reviewConnectionRequest = asyncHandler(
// 	async (req: Request, res: Response) => {
// 	  const loggedInUser = req.user;
// 	  const { requestId, status } = req.params;
  
// 	  if (!loggedInUser?._id) {
// 		throw new ApiError(401, "Unauthorized request");
// 	  }
  
// 	  // Validate status
// 	  const allowedStatus = [
// 		CONNECTION_STATUS.ACCEPTED,
// 		CONNECTION_STATUS.REJECTED,
// 	  ];
  
// 	  if (!allowedStatus.includes(status as any)) {
// 		throw new ApiError(400, `Invalid status type: ${status}`);
// 	  }
  
// 	  if (!mongoose.Types.ObjectId.isValid(requestId)) {
// 		throw new ApiError(400, "Invalid request id");
// 	  }
  
// 	  const connectionRequest = await ConnectionRequest.findOne({
// 		_id: new mongoose.Types.ObjectId(requestId),
// 		toUserId: loggedInUser._id,
// 		status: CONNECTION_STATUS.INTERESTED,
// 	  });
  
// 	  if (!connectionRequest) {
// 		throw new ApiError(404, "Connection request not found");
// 	  }
  
// 	  connectionRequest.status = status as typeof CONNECTION_STATUS.ACCEPTED;
  
// 	  const updatedRequest = await connectionRequest.save();
  
// 	  return res.status(200).json(
// 		new ApiResponse(
// 		  200,
// 		  updatedRequest,
// 		  `Connection request ${status.toLowerCase()} successfully`,
// 		),
// 	  );
// 	},
//   );

// // Get all pending connection request of user

// const findAllConnectionRequests = asyncHandler(
// 	async (req: Request, res: Response) => {
// 	  const loggedInUser = req.user;
  
// 	  if (!loggedInUser?._id) {
// 		throw new ApiError(401, "Unauthorized request");
// 	  }
  
// 	  const pendingRequests = await ConnectionRequest.find({
// 		toUserId: loggedInUser._id,
// 		status: CONNECTION_STATUS.INTERESTED,
// 	  }).populate("fromUserId", PUBLIC_USE_DATA);
// 	  console.log("PENDING REQUEST ", pendingRequests)
// 	  return res.status(200).json(
// 		new ApiResponse(
// 		  200,
// 		  pendingRequests,
// 		  "Pending connection requests fetched successfully",
// 		),
// 	  );
// 	},
//   );

// const findAllConnectedRequest = asyncHandler(
// 	async (req: Request, res: Response) => {
// 		const loggedInUser = req.user;

// 		const allConnectedUser = await ConnectionRequest.find({
// 			$or: [
// 				{ toUserId: loggedInUser._id, status: "accepted" },
// 				{ fromUserId: loggedInUser._id, status: "accepted" },
// 			],
// 		})
// 			.populate("fromUserId", PUBLIC_USE_DATA)
// 			.populate("toUserId", PUBLIC_USE_DATA);

// 		if (!allConnectedUser) {
// 			throw new ApiError(404, "No Connection found");
// 		}

// 		/**
// 		 * Return the user which status are accepted but not loggedin user
// 		 */

// 		const allConnections = allConnectedUser.map((row) => {
// 			if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
// 				return row.toUserId;
// 			}

// 			return row.fromUserId;
// 		});

// 		return res
// 			.status(200)
// 			.json(
// 				new ApiResponse(
// 					200,
// 					allConnections,
// 					"All connection request fetched successfully"
// 				)
// 			);
// 	}
// );

// // return all user and add the pagination for restrict the no of user to send the the frontend

// /**
//  * Loggedin user is not interested whom he is already connected, rejected and ignored
//  */

// /**
//  * find all user which are connected to the loggedin user
//  * USER SHOULD SEE ALL THE USER CARDS EXCEPT
//  *      1. His on card
//  *      2. His connection
//  *      3. Ignored poeople
//  *      4. Already send connection request
//  */

// // Feed API

// const findAllUsersForFeed = asyncHandler(async (req: Request, res: Response) => {
// 	const loggedInUser = req.user!;
  
// 	const page =
// 	  typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
  
// 	let limit =
// 	  typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 10;
  
// 	limit = Math.min(limit, 50);
// 	const skip = (page - 1) * limit;
  
// 	const connectionRequests = await ConnectionRequest.find({
// 	  $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
// 	}).select("fromUserId toUserId");
  
// 	const hideUserFromFeed = new Set<string>();
  
// 	connectionRequests.forEach((req) => {
// 	  hideUserFromFeed.add(req.fromUserId.toString());
// 	  hideUserFromFeed.add(req.toUserId.toString());
// 	});
  
// 	hideUserFromFeed.add(loggedInUser._id.toString());
  
// 	const users = await User.find({
// 	  _id: { $nin: Array.from(hideUserFromFeed) },
// 	})
// 	  .select(PUBLIC_USE_DATA)
// 	  .skip(skip)
// 	  .limit(limit);
// 	console.log("USERS : ", users)
// 	return res
// 	  .status(200)
// 	  .json(new ApiResponse(200, users, "Feed users fetched successfully"));
//   });
  

// export {
// 	sendConnectionRequest,
// 	reviewConnectionRequest,
// 	findAllConnectionRequests,
// 	findAllConnectedRequest,
// 	findAllUsersForFeed,
// };


import { Request, Response } from "express";
import { ConnectionRequest } from "../models/connection.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { CONNECTION_STATUS } from "../constant/connection.status.js";

const PUBLIC_USE_DATA = "firstName lastName photoUrl age gender skills about";

const sendConnectionRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const fromUserId = req.user?._id;
    const { toUserId } = req.params;
    const { status } = req.params;

    // Validate fromUserId exists
    if (!fromUserId) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Validate status
    const allowedStatus = [CONNECTION_STATUS.INTERESTED, CONNECTION_STATUS.IGNORED];
    if (!allowedStatus.includes(status as any)) {
      throw new ApiError(400, `Invalid status type: ${status}`);
    }

    // Validate toUserId format
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      throw new ApiError(400, "Invalid user ID format");
    }

    // Prevent self-connection
    if (fromUserId.toString() === toUserId) {
      throw new ApiError(400, "You cannot send a connection request to yourself");
    }

    // Check if toUserId exists in database
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new ApiError(404, "User not found");
    }

    // Check if connection request already exists (bidirectional check)
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

    // Populate user data for better response
    await sentConnectionReq.populate("toUserId", PUBLIC_USE_DATA);

    const message = 
      status === CONNECTION_STATUS.INTERESTED 
        ? "Connection request sent successfully" 
        : "User ignored successfully";

    return res.status(201).json(
      new ApiResponse(201, sentConnectionReq, message)
    );
  }
);

const reviewConnectionRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUser = req.user;
    const { requestId, status } = req.params;

    // Validate user authentication
    if (!loggedInUser?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Validate request ID format
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      throw new ApiError(400, "Invalid request ID format");
    }

    // Validate status
    const allowedStatus = [
      CONNECTION_STATUS.ACCEPTED,
      CONNECTION_STATUS.REJECTED,
    ];

    if (!allowedStatus.includes(status as any)) {
      throw new ApiError(400, `Invalid status type: ${status}`);
    }

    // Find the connection request with all validations in one query
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

    // Populate both users for complete response
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

const findAllConnectionRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUser = req.user;

    if (!loggedInUser?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Find all pending requests sent to the logged-in user
    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: CONNECTION_STATUS.INTERESTED,
    })
      .populate("fromUserId", PUBLIC_USE_DATA)
      .sort({ createdAt: -1 }); // Show newest first

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

const findAllConnectedRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUser = req.user;

    if (!loggedInUser?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Find all accepted connections (bidirectional)
    const allConnectedUser = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: CONNECTION_STATUS.ACCEPTED },
        { fromUserId: loggedInUser._id, status: CONNECTION_STATUS.ACCEPTED },
      ],
    })
      .populate("fromUserId", PUBLIC_USE_DATA)
      .populate("toUserId", PUBLIC_USE_DATA)
      .sort({ updatedAt: -1 }); // Show recently accepted first

    // Extract the connected users (not the logged-in user)
    const allConnections = allConnectedUser.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
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

const findAllUsersForFeed = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUser = req.user!;

    if (!loggedInUser?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Parse and validate pagination parameters
    const page = Math.max(
      1,
      typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1
    );

    let limit = Math.max(
      1,
      typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 10
    );

    limit = Math.min(limit, 50); // Cap at 50 users per page
    const skip = (page - 1) * limit;

    // Find all connection requests involving the logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    // Build set of user IDs to hide from feed
    const hideUserFromFeed = new Set<string>();

    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    // Also hide the logged-in user
    hideUserFromFeed.add(loggedInUser._id.toString());

    // Get total count for pagination metadata
    const totalUsers = await User.countDocuments({
      _id: { $nin: Array.from(hideUserFromFeed) },
    });

    // Fetch users for feed
    const users = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) },
    })
      .select(PUBLIC_USE_DATA)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Show newer users first

    // Calculate pagination metadata
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
  findAllConnectedRequest,
  findAllUsersForFeed,
};