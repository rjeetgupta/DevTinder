import { Schema, model } from "mongoose";
import { IPayment } from "../types/payment.types.js";

const paymentSchema = new Schema<IPayment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: String,
            required: true,
            index: true,
        },
        paymentId: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        notes: {
            firstName: { type: String },
            lastName: { type: String },
            emailId: { type: String },
            memberShipType: { type: String },
        },
        status: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Payment = model<IPayment>("Payment", paymentSchema);
export default Payment;
