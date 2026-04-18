import { Schema, model, Document, Types } from "mongoose";

export interface IMessage {
    senderId: Types.ObjectId;
    text: string;
    seen: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IChat extends Document {
    participants: Types.ObjectId[];
    messages: IMessage[];
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const chatSchema = new Schema<IChat>(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        messages: [messageSchema],

        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Fast chat lookup by users
chatSchema.index({ participants: 1 });
chatSchema.index({ lastMessageAt: -1 });

const Chat = model<IChat>("Chat", chatSchema);
export default Chat;