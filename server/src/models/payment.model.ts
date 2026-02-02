import { Schema, model } from "mongoose";
import { SubscriptionTier } from "../utils/constant"; 

const paymentSchema = new Schema({
    orderId: {
      type: String,
      required: true,
      index: true,
    },

    paymentId: {
      type: String,
      default: null,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscriptionTier: {
      type: String,
      enum: Object.values(SubscriptionTier),
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed"],
      required: true,
      default: "created",
    },

    receipt: {
      type: String,
    },
  },
  { timestamps: true }
);

const Payment = model("Payment", paymentSchema);
export default Payment;
