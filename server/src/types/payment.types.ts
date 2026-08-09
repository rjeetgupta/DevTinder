import { Types, Document } from "mongoose";

export interface IPaymentNotes {
    firstName?: string;
    lastName?: string;
    emailId?: string;
    memberShipType?: string;
}

export interface IPayment extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    orderId: string;
    paymentId?: string;
    amount: number;
    currency: string;
    notes: IPaymentNotes;
    status: string;
}
