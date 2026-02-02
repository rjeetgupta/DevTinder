import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import Payment from "../models/payment.model";
import User from "../models/user.model";
import razorpayInstance from "../utils/razorpay";
import { SubscriptionPlans, SubscriptionTier } from "../utils/constant";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export const createMembershipOrder = asyncHandler(async (req: Request, res: Response) => {
    const { subscriptionTier } = req.body as {
        subscriptionTier: SubscriptionTier;
    };
      
    const user = req.user;

    // Validate tier
    const plan = SubscriptionPlans[subscriptionTier];
    if (!Object.values(SubscriptionTier).includes(subscriptionTier)) {
        throw new ApiError(400, "Invalid subscription tier");
    }  

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
        amount: plan.price * 100, // in paise
        currency: "INR",
        receipt: `membership_${Date.now()}`,
        notes: {
            userId: user._id.toString(),
            subscriptionTier,
        },
    });

    // Save payment record
    const payment = await Payment.create({
        userId: user._id,
        orderId: order.id,
        subscriptionTier,
        amount: order.amount,
        currency: order.currency,
        status: "created",
        receipt: order.receipt,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            payment,
            "Order created successfully"
        )
    );
},
);

// Razorpay Webhook

export const razorpayWebhook = asyncHandler(
    async (req: Request, res: Response) => {
        const signature = req.headers["x-razorpay-signature"] as string;

        // Verify webhook signature
        const isValid = validateWebhookSignature(
            JSON.stringify(req.body),
            signature,
            process.env.RAZORPAY_WEBHOOK_SECRET!,
        );

        if (!isValid) {
            throw new ApiError(400, "Invalid webhook signature");
        }

        // Only handle successful payments
        if (req.body.event !== "payment.captured") {
            return res.status(200).json(new ApiResponse(200, "Event ignored"));
        }

        const paymentEntity = req.body.payload.payment.entity;

        // Find payment record
        const payment = await Payment.findOne({
            orderId: paymentEntity.order_id,
        });

        if (!payment) {
            throw new ApiError(404, "Payment not found");
        }

        // Update payment status
        payment.paymentId = paymentEntity.id;
        payment.status = "captured";
        await payment.save();

        // Find user
        const user = await User.findById(payment.userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Get plan details
        const plan = SubscriptionPlans[payment.subscriptionTier];

        // Calculate validity
        const now = new Date();
        const baseDate =
            user.membershipValidity && user.membershipValidity > now
                ? user.membershipValidity
                : now;

        // Activate membership
        user.isPremium = true;
        user.subscriptionTier = payment.subscriptionTier;
        user.membershipValidity = new Date(
            baseDate.getTime() + plan.validityDays * 24 * 60 * 60 * 1000,
        );

        // GOLD users → profile verified
        if (payment.subscriptionTier === SubscriptionTier.GOLD) {
            user.isProfileVerified = true;
        }

        await user.save();

        return res
            .status(200)
            .json(new ApiResponse(200, "Membership activated"));
    },
);

// Verify Membership (Frontend)

export const verifyMembershipStatus = asyncHandler(
    async (req: Request, res: Response) => {
        const user = req.user;

        const isActive =
            user.isPremium &&
            user.membershipValidity &&
            user.membershipValidity > new Date();

        return res.status(200).json(
            new ApiResponse(200, {
                isPremium: isActive,
                subscriptionTier: isActive
                    ? user.subscriptionTier
                    : SubscriptionTier.FREE,
                validTill: user.membershipValidity,
                profileVerified: user.profileVerified,
            }),
        );
    },
);
