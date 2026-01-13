import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  sendConnectionRequest,
  reviewConnectionRequest,
  findAllConnectionRequests,
  findAllUsersForFeed,
  findAllConnectedUsers,
} from "../controllers/connection.controller.js";
import {
  validateObjectId,
  validateConnectionStatus,
  rateLimitConnectionRequests,
  validatePagination,
} from "../middlewares/connection.middleware.js";
import { CONNECTION_STATUS } from "../constant/connection.status";

const router: Router = Router();

/**
 * @route   POST /api/v1/connections/request/send/:status/:toUserId
 * @desc    Send a connection request (interested) or ignore a user
 * @access  Private
 * @params  status - "interested" or "ignored"
 *          toUserId - ID of the user to send request to
 */
router.route("/request/send/:status/:toUserId").post(
  verifyJWT,
  rateLimitConnectionRequests(10, 60000), // 10 requests per minute
  validateConnectionStatus([
    CONNECTION_STATUS.INTERESTED,
    CONNECTION_STATUS.IGNORED,
  ]),
  validateObjectId("toUserId"),
  sendConnectionRequest
);

/**
 * @route   POST /api/v1/connections/request/review/:status/:requestId
 * @desc    Review a connection request (accept or reject)
 * @access  Private
 * @params  status - "accepted" or "rejected"
 *          requestId - ID of the connection request
 */
router.route("/request/review/:status/:requestId").post(
  verifyJWT,
  validateConnectionStatus([
    CONNECTION_STATUS.ACCEPTED,
    CONNECTION_STATUS.REJECTED,
  ]),
  validateObjectId("requestId"),
  reviewConnectionRequest
);

/**
 * @route   GET /api/v1/connections/request/pending
 * @desc    Get all pending connection requests for the logged-in user
 * @access  Private
 */
router.route("/request/pending").get(
  findAllConnectionRequests
);

/**
 * @route   GET /api/v1/connections
 * @desc    Get all accepted connections of the logged-in user
 * @access  Private
 */
router.route("/").get(
  verifyJWT,
  findAllConnectedUsers
);

/**
 * @route   GET /api/v1/connections/feed
 * @desc    Get user feed (users not connected with)
 * @access  Private
 * @query   page - Page number (default: 1)
 *          limit - Users per page (default: 10, max: 50)
 */
router.route("/feed").get(
  verifyJWT,
  validatePagination,
  findAllUsersForFeed
);

export default router;