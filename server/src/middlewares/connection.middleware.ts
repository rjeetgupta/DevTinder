import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

/**
 * Validate MongoDB ObjectId format
 */
export const validateObjectId = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, `Invalid ${paramName} format`);
    }
    
    next();
  };
};

/**
 * Validate connection status parameter
 */
export const validateConnectionStatus = (allowedStatuses: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const status = req.params.status || req.body.status;
    
    if (!status) {
      throw new ApiError(400, "Status is required");
    }
    
    if (!allowedStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`
      );
    }
    
    next();
  };
};

/**
 * Rate limiting for connection requests (in-memory)
 * For production, use Redis
 */
const requestTimestamps = new Map<string, number[]>();

export const rateLimitConnectionRequests = (
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id.toString();
    
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    
    const now = Date.now();
    const timestamps = requestTimestamps.get(userId) || [];
    
    // Filter out timestamps outside the window
    const recentTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < windowMs
    );
    
    if (recentTimestamps.length >= maxRequests) {
      throw new ApiError(
        429,
        `Too many requests. Please try again after ${Math.ceil(windowMs / 1000)} seconds`
      );
    }
    
    recentTimestamps.push(now);
    requestTimestamps.set(userId, recentTimestamps);
    
    next();
  };
};

/**
 * Validate pagination parameters
 */
export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  if (page < 1) {
    throw new ApiError(400, "Page number must be greater than 0");
  }
  
  if (limit < 1 || limit > 50) {
    throw new ApiError(400, "Limit must be between 1 and 50");
  }
  
  // Attach validated values to request
  req.query.page = page.toString();
  req.query.limit = limit.toString();
  
  next();
};