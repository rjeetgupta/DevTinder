import { Schema, model, Document, Types } from "mongoose";

export interface IConnectionRequest extends Document {
    fromUserId: Types.ObjectId;
    toUserId: Types.ObjectId;
    status: "ignored" | "interested" | "accepted" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}

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
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`,
            },
            default: "interested",
        },
    },
    { timestamps: true }
);

connectionRequestSchema.index(
    { fromUserId: 1, toUserId: 1 },
    { unique: true }
);

// Fast queries (incoming / outgoing requests)
connectionRequestSchema.index({ toUserId: 1 });
connectionRequestSchema.index({ fromUserId: 1 });

connectionRequestSchema.pre(
    "save",
    function (this: IConnectionRequest, next) {
        if (this.fromUserId.equals(this.toUserId)) {
            return next(
                new Error("Cannot send connection request to yourself")
            );
        }
        next();
    }
);

export const ConnectionRequest = model<IConnectionRequest>(
    "ConnectionRequest",
    connectionRequestSchema
);