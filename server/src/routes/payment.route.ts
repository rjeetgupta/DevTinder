import express, { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware";
import {
    createMembershipOrder,
    razorpayWebhook,
    verifyMembershipStatus,
} from "../controllers/payment.controller";

const router: Router = Router();

router.route("/create-order").post(verifyJWT, createMembershipOrder);
router
    .route("/webhook")
    .post(express.raw({ type: "application/json" }), razorpayWebhook);
router.route("/verify").get(verifyJWT, verifyMembershipStatus);

export default router;
