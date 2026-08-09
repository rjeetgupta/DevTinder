import express, { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { createOrder, razorpayWebhook, verifyPremium } from "../controllers/payment.controller.js";

const router: Router = Router();

router.route("/create").post(verifyJWT, createOrder);
router.route("/webhook").post(express.raw({ type: "application/json" }), razorpayWebhook);
router.route("/premium/verify").post(verifyJWT, verifyPremium);

export default router;
