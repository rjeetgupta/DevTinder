import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JwtPayload } from "../types/auth.types";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as JwtPayload;

        // req.user = decoded._id;

        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Invalid user" });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};


export default verifyJWT;