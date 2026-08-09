import { Types, Document } from "mongoose";

export interface IMessage {
    _id?: Types.ObjectId;
    senderId: Types.ObjectId;
    text: string;
    seen: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IChat extends Document {
    _id: Types.ObjectId;
    participants: Types.ObjectId[];
    messages: IMessage[];
    lastMessageAt: Date;
}
