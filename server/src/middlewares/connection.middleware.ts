import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

/** Validate MongoDB ObjectId route params. */
export const validateObjectId = (paramName: string) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const id = req.params[paramName] as string;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, `Invalid ${paramName} format`);
        }
        next();
    };
};

/** Validate a connection status route param against an allowed set. */
export const validateConnectionStatus = (allowedStatuses: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const status = req.params.status as string;
        if (!status) {
            throw new ApiError(400, "Status is required");
        }
        if (!allowedStatuses.includes(status)) {
            throw new ApiError(400, `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`);
        }
        next();
    };
};

/** In-memory sliding-window rate limit for connection requests. Swap for Redis in production. */
const requestTimestamps = new Map<string, number[]>();

export const rateLimitConnectionRequests = (maxRequests = 10, windowMs = 60000) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const userId = req.user?._id.toString();
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const now = Date.now();
        const timestamps = requestTimestamps.get(userId) || [];
        const recentTimestamps = timestamps.filter((timestamp) => now - timestamp < windowMs);

        if (recentTimestamps.length >= maxRequests) {
            throw new ApiError(429, `Too many requests. Please try again after ${Math.ceil(windowMs / 1000)} seconds`);
        }

        recentTimestamps.push(now);
        requestTimestamps.set(userId, recentTimestamps);
        next();
    };
};

/** Normalize + validate pagination fields, whether sent as query or body params. */
export const validatePagination = (req: Request, _res: Response, next: NextFunction) => {
    const source = Object.keys(req.query).length > 0 ? req.query : req.body;

    const page = parseInt(source.page as string) || 1;
    const limit = parseInt(source.limit as string) || 10;

    if (page < 1) {
        throw new ApiError(400, "Page number must be greater than 0");
    }
    if (limit < 1 || limit > 50) {
        throw new ApiError(400, "Limit must be between 1 and 50");
    }

    req.body.page = page;
    req.body.limit = limit;
    next();
};
