import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  userId: Types.ObjectId;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;

  notes: {
    firstName?: string;
    lastName?: string;
    emailId?: string;
    memberShipType?: string;
  };

  status: "created" | "pending" | "success" | "failed";

  createdAt: Date;
  updatedAt: Date;
}

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
      trim: true,
    },

    paymentId: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      required: true,
      uppercase: true,
    },

    notes: {
      firstName: String,
      lastName: String,
      emailId: String,
      memberShipType: String,
    },

    status: {
      type: String,
      required: true,
      enum: ["created", "pending", "success", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);


paymentSchema.index({ userId: 1 });
paymentSchema.index({ orderId: 1 }, { unique: true });
paymentSchema.index({ status: 1 });


const Payment = model<IPayment>("Payment", paymentSchema);
export default Payment;