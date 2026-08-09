import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    validateObjectId,
    validateConnectionStatus,
    rateLimitConnectionRequests,
} from "../middlewares/connection.middleware.js";
import { CONNECTION_STATUS } from "../constant/connection.status.js";
import {
    sendConnectionRequest,
    reviewConnectionRequest,
    checkIsConnected,
} from "../controllers/connection.controller.js";

const router: Router = Router();

router.route("/request/send/:status/:toUserId").post(
    verifyJWT,
    rateLimitConnectionRequests(10, 60000),
    validateConnectionStatus([CONNECTION_STATUS.INTERESTED, CONNECTION_STATUS.IGNORED]),
    validateObjectId("toUserId"),
    sendConnectionRequest
);

router.route("/request/review/:status/:requestId").post(
    verifyJWT,
    validateConnectionStatus([CONNECTION_STATUS.ACCEPTED, CONNECTION_STATUS.REJECTED]),
    validateObjectId("requestId"),
    reviewConnectionRequest
);

router.route("/user/is-connected/:targetUserId").get(verifyJWT, checkIsConnected);

export default router;
