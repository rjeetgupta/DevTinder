import { ZodError } from "zod";
import ApiError from "../utils/ApiError";
import { Request, Response, NextFunction } from "express";

export const validate =
    (schema: any) => (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Extract ONLY messages:
                const messages = error.issues.map((issue) => issue.message);

                return next(
                    new ApiError(400, "Validation error", messages)
                );
            }

            return next(new ApiError(500, "Validation failed"));
        }
    };
