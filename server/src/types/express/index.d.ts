import "express";
import { IUser } from "../user.model";

declare module "express" {
    interface Request {
        user?: IUser;
    }
}
