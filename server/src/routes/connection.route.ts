import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  sendConnectionRequest,
  reviewConnectionRequest,
  findAllConnectionRequests,
  findAllConnectedRequest,
  findAllUsersForFeed,
} from "../controllers/connection.controller.js";


const router: Router = Router();


/**
 * @route   POST /api/v1/request/send/:status/:toUserId
 * @desc    Send a connection request (interested) or ignore a user
 * @access  Private
 * @params  status - "interested" or "ignored"
 *          toUserId - ID of the user to send request to
 */
router.route("/request/send/:status/:toUserId").post(
  verifyJWT,
  sendConnectionRequest
)

/**
 * @route   POST /api/v1/request/review/:status/:requestId
 * @desc    Review a connection request (accept or reject)
 * @access  Private
 * @params  status - "accepted" or "rejected"
 *          requestId - ID of the connection request
 */
router.route("/request/review/:status/:requestId").post(
  verifyJWT,
  reviewConnectionRequest
)

/**
 * @route   GET /api/v1/request/pending
 * @desc    Get all pending connection requests for the logged-in user
 * @access  Private
 */
router.route("/request/pending").get(
  verifyJWT,
  findAllConnectionRequests
)

/**
 * @route   GET /api/v1/connections
 * @desc    Get all accepted connections of the logged-in user
 * @access  Private
 */
router.route("/connections").get(
  verifyJWT,
  findAllConnectedRequest
)

/**
 * @route   GET /api/v1/feed
 * @desc    Get user feed (users not connected with)
 * @access  Private
 * @query   page - Page number (default: 1)
 *          limit - Users per page (default: 10, max: 50)
 */
router.route("/feed").get(findAllUsersForFeed)

export default router;