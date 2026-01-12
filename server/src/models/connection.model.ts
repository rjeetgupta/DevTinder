import mongoose, { Schema } from "mongoose";
import { IConnection } from "../types/connection.types";
import ApiError from "../utils/ApiError";

const connectionSchema = new Schema<IConnection>({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "accepted", "rejected", "interested"],
            message: `{VALUES} is incorrect status types`
        },
        default: "interested",
    }
}, { timestamps: true })

// Compound index
connectionSchema.index({ fromUserId: 1, toUserId: 1 })

connectionSchema.pre("save", function (next) {
    if (this.toUserId.equals(this.fromUserId)) {
        throw new ApiError(400, "You can not send the connection request yourself")
    }
    next();
})

export const ConnectionRequest = mongoose.model<IConnection>("ConnectionRequest", connectionSchema);
