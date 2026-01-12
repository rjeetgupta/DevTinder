import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware.js";
import ApiError  from "./utils/ApiError.js";

const app: Express = express();

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));

dotenv.config();

// Body parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookie parser
app.use(cookieParser());



// import all routes
import userRoutes from "./routes/user.route.js";
import connectionRoutes from "./routes/connection.route.js";



// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/connections", connectionRoutes)

// Health check
app.get("/health", (_, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, _, next) => {
    next(new ApiError(
        404,
        `Route ${req.originalUrl} not found`
    ));
});

// Global error handler
app.use(errorHandler);

export default app;