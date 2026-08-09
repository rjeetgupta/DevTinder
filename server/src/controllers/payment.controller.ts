import { Request, Response } from "express";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpayInstance from "../utils/razorpay.js";
import { memberAmount, membershipValidityDays } from "../utils/constant.js";

/**
 * POST /payment/create
 * Response is intentionally flat (no ApiResponse wrapper) — the frontend
 * reads `keyId`/`amount`/`currency`/`orderId`/`notes` straight off the body.
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { memberShipType } = req.body as { memberShipType: string };
    const { _id, firstName, lastName, emailId } = req.user!;

    const amount = memberAmount[memberShipType];
    if (!amount) {
        throw new ApiError(400, "Invalid membership type");
    }

    const order = await razorpayInstance.orders.create({
        amount: amount * 100, // paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { firstName, lastName: lastName || "", emailId, memberShipType },
    });

    const payment = await Payment.create({
        userId: _id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        notes: order.notes,
        status: order.status,
    });

    res.status(201).json({
        success: true,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: payment.amount,
        currency: payment.currency,
        orderId: payment.orderId,
        notes: payment.notes,
    });
});

// POST /payment/webhook
export const razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers["x-razorpay-signature"] as string;

    const isValid = validateWebhookSignature(
        JSON.stringify(req.body),
        signature,
        process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
        throw new ApiError(400, "Invalid webhook signature");
    }

    const paymentEntity = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentEntity.order_id });
    if (!payment) {
        throw new ApiError(404, "Payment record not found");
    }

    payment.paymentId = paymentEntity.id;
    payment.status = paymentEntity.status;
    await payment.save();

    if (req.body.event === "payment.captured") {
        const user = await User.findById(payment.userId);
        if (user) {
            const memberShipType = payment.notes.memberShipType || "";
            const validityDays = membershipValidityDays[memberShipType] || 30;

            const now = new Date();
            const baseDate =
                user.membershipValidTill && user.membershipValidTill > now
                    ? user.membershipValidTill
                    : now;

            user.isPremium = true;
            user.memberShipType = memberShipType || null;
            user.membershipValidTill = new Date(baseDate.getTime() + validityDays * 24 * 60 * 60 * 1000);
            await user.save();
        }
    }

    res.status(200).json({ success: true, message: "Webhook received successfully" });
});

// POST /payment/premium/verify
export const verifyPremium = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;

    const isActive = Boolean(
        user.isPremium && user.membershipValidTill && user.membershipValidTill > new Date()
    );

    res.status(200).json({
        success: true,
        isPremium: isActive,
        memberShipType: isActive ? user.memberShipType : null,
        user,
    });
});
