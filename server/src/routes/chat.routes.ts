import { Router } from "express";
import {
    getUnreadCount,
    getChatList,
    getChatByUser,
    isConnected,
} from "../controllers/chat.controller";
import verifyJWT from "../middlewares/auth.middleware";

const router: Router = Router();


router.route("/chat/unread-count").get(verifyJWT, getUnreadCount);
router.route("/chat/list").get(verifyJWT, getChatList);
router.route("/chat/:targetUserId").get(verifyJWT, getChatByUser);
router.route("/chat/is-connected/:targetUserId").get(verifyJWT, isConnected);

export default router;