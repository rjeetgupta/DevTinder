import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JwtPayload } from "../types/auth.types.js";

/**
 * Reads the `token` cookie set on login/signup, verifies it, and
 * attaches the full user document to `req.user`. Kept as a single
 * short-lived JWT (no refresh-token pair) to match the frontend, which
 * never calls a refresh endpoint.
 */
const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Please login!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found!" });
        }

        req.user = user;
        return next();
    } catch (error: any) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default verifyJWT;
