import "express";
import { IUser } from "./user.types.js";

declare module "express" {
    interface Request {
        user?: IUser;
    }
}
