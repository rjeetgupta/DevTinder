import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const statusCode = err.statusCode || 500;

    const response: any = {
        success: false,
    };

    if (Array.isArray(err.errors) && err.errors.length > 0) {
        response.errors = err.errors;
    } else {
        response.errors = [err.message || "Something went wrong"];
    }

    res.status(statusCode).json(response);
};
