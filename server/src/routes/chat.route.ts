import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    getChatHistory,
    getChatList,
    getUnreadCount,
    checkChatIsConnected,
} from "../controllers/chat.controller.js";

const router: Router = Router();

router.route("/unread-count").get(verifyJWT, getUnreadCount);
router.route("/list").get(verifyJWT, getChatList);
router.route("/is-connected/:targetUserId").get(verifyJWT, checkChatIsConnected);
router.route("/:targetUserId").get(verifyJWT, getChatHistory);

export default router;
