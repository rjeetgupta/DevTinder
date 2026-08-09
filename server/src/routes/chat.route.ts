import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    getChatHistory,
    getChatList,
    getUnreadCount,
    checkChatIsConnected,
} from "../controllers/chat.controller.js";

const router: Router = Router();

router.route("/chat/unread-count").get(verifyJWT, getUnreadCount);
router.route("/chat/list").get(verifyJWT, getChatList);
router.route("/chat/is-connected/:targetUserId").get(verifyJWT, checkChatIsConnected);
router.route("/chat/:targetUserId").get(verifyJWT, getChatHistory);

export default router;
