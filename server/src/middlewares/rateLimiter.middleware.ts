import { Request, Response, NextFunction } from "express";
import TokenBucket from "../utils/TokenBucket.js";

// Map<userId | ip, TokenBucket>
const buckets = new Map<string, TokenBucket>();

/**
 * Token-bucket rate limiter, keyed by user id (falls back to IP for
 * unauthenticated requests). Used to throttle the Gemini AI coach.
 *
 * @param capacity   max burst size (e.g. 5 rapid requests)
 * @param refillRate tokens added per second (e.g. 0.1 = 1 token / 10s)
 */
export const tokenBucketLimiter = (capacity: number, refillRate: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.user ? req.user._id.toString() : req.ip || "unknown";

        if (!buckets.has(key)) {
            buckets.set(key, new TokenBucket(capacity, refillRate));
        }

        const bucket = buckets.get(key)!;

        if (bucket.tryConsume(1)) {
            next();
        } else {
            res.status(429).json({
                success: false,
                message: "Rate limit exceeded. Please wait a moment before trying again.",
            });
        }
    };
};
