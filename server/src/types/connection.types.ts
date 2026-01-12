import { Types } from "mongoose";
export type Status = "ignored" | "accepted" | "rejected" | "interested";

export interface IConnection {
    fromUserId: Types.ObjectId;
    toUserId: Types.ObjectId;
    status: Status;
}