import { Types, Document } from "mongoose";
import { ConnectionStatus } from "../constant/connection.status.js";

export interface IConnectionRequest extends Document {
    _id: Types.ObjectId;
    fromUserId: Types.ObjectId;
    toUserId: Types.ObjectId;
    status: ConnectionStatus;
    createdAt: Date;
    updatedAt: Date;
}
