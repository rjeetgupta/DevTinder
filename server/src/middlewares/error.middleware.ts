import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;

    const response: any = {
        success: false
    };

    // If errors array exists, return them
    if (Array.isArray(err.errors) && err.errors.length > 0) {
        response.errors = err.errors;
    } else {
        // Fallback to single message
        response.errors = [err.message || "Something went wrong"];
    }

    return res.status(statusCode).json(response);
};
