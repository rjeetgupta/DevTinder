import { Schema, model } from "mongoose";
import { IConnectionRequest } from "../types/connection.types.js";
import { CONNECTION_STATUS } from "../constant/connection.status.js";

const connectionRequestSchema = new Schema<IConnectionRequest>(
    {
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
                values: Object.values(CONNECTION_STATUS),
                message: "{VALUE} is an incorrect status type",
            },
        },
    },
    { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
    if (this.fromUserId.equals(this.toUserId)) {
        return next(new Error("Cannot send a connection request to yourself"));
    }
    next();
});

const ConnectionRequestModel = model<IConnectionRequest>("ConnectionRequest", connectionRequestSchema);
export default ConnectionRequestModel;
