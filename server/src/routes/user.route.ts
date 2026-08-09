import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { validatePagination } from "../middlewares/connection.middleware.js";
import {
    getReceivedRequests,
    getConnections,
    getFeedUsers,
    getSuggestedSkills,
    getUserById,
    searchUsers,
    getIgnoredRequests,
    resendConnectionRequest,
} from "../controllers/user.controller.js";

const router: Router = Router();

router.route("/request/received").get(verifyJWT, getReceivedRequests);
router.route("/request/ignored").post(verifyJWT, getIgnoredRequests);
router.route("/resend-request/send/:status/:toUserId").post(verifyJWT, resendConnectionRequest);
router.route("/connections").get(verifyJWT, getConnections);
router.route("/feed").post(verifyJWT, validatePagination, getFeedUsers);
router.route("/suggested-skills").get(verifyJWT, getSuggestedSkills);
router.route("/search").get(verifyJWT, searchUsers);
router.route("/:id").get(verifyJWT, getUserById);

export default router;
