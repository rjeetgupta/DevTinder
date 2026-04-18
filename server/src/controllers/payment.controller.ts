// controllers/payment.controller.ts

import { Request, Response } from "express";
import Razorpay from "razorpay";
import razorpayInstance from "../utils/razorpay";
import Payment from "../models/payment.model";
import User from "../models/user.model";
import { memberAmount, MembershipType } from "../utils/constant";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { IUser } from "../types/user.types";

interface AuthRequest extends Request {
    user: IUser;
}

type PaymentNotes = {
    firstName: string;
    lastName: string;
    email: string;
    memberShipType: MembershipType;
};

export const createPayment = async (
    req: Request,
    res: Response
) => {
    try {
        console.log("Payment request received");

        const { memberShipType } = req.body as {
            memberShipType: MembershipType;
        };

        // Validate membership type
        if (!memberAmount[memberShipType]) {
            return res.status(400).json({
                success: false,
                message: "Invalid membership type",
            });
        }

        const { _id, firstName, email } = req.user;

        const order = await razorpayInstance.orders.create({
            amount: memberAmount[memberShipType] * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                firstName,
                email,
                memberShipType,
            },
        });

        const payment = new Payment({
            userId: _id,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            notes: order.notes,
            status: order.status,
            memberShipType,
        });

        const savedPayment = await payment.save();

        res.status(201).json({
            success: true,
            ...savedPayment.toJSON(),
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.error("Create Payment Error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const handleWebhook = async (
    req: Request,
    res: Response
) => {
    try {
        const signature = req.get("x-razorpay-signature") as string;

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
            throw new Error("Webhook secret not defined");
        }

        const isValid = validateWebhookSignature(
            JSON.stringify(req.body),
            signature,
            secret
        );

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid signature",
            });
        }

        const paymentDetails = req.body.payload.payment.entity;

        const paymentRecord = await Payment.findOne({
            orderId: paymentDetails.order_id,
        });

        if (!paymentRecord) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found",
            });
        }

        // Update payment status
        paymentRecord.status = paymentDetails.status;
        await paymentRecord.save();

        // Typed notes
        const notes = paymentRecord.notes as PaymentNotes;

        // Upgrade user
        const user = await User.findById(paymentRecord.userId);

        if (user) {
            user.isPremium = true;
            user.memberShipType = notes.memberShipType;
            await user.save();
        }

        // Logs
        if (req.body.event === "payment.captured") {
            console.log("Payment captured:", paymentDetails.order_id);
        }

        if (req.body.event === "payment.failed") {
            console.log("Payment failed:", paymentDetails.order_id);
        }

        res.status(200).json({
            success: true,
            message: "Webhook processed successfully",
        });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyPremium = async (
    req: Request,
    res: Response
) => {
    try {
        const user = req.user;

        if (user.isPremium) {
            return res.status(200).json({
                success: true,
                isPremium: true,
                memberShipType: user.memberShipType,
                user,
            });
        }

        return res.status(200).json({
            success: true,
            isPremium: false,
            user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};