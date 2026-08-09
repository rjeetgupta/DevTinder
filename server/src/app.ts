import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import ApiError from "./utils/ApiError.js";

const app: Express = express();

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (origin === process.env.FRONTEND_URL) return callback(null, true);
            if (origin.startsWith("http://localhost")) return callback(null, true);
            return callback(null, false);
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ---------- Routes ----------
import authRoutes from "./routes/auth.route.js";
import profileRoutes from "./routes/profile.route.js";
import requestRoutes from "./routes/request.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import paymentRoutes from "./routes/payment.route.js";
import geminiRoutes from "./routes/gemini.route.js";

app.use("/api", authRoutes); // /api/login, /api/signup
app.use("/api", profileRoutes); // /api/profile/view
app.use("/api", requestRoutes); // /api/request/send/:status/:toUserId
app.use("/api/user", userRoutes); // /api/user/feed
app.use("/api", chatRoutes); // /api/chat/:targetUserId
app.use("/api/payment", paymentRoutes); // /api/payment/create
app.use("/api/gemini", geminiRoutes); // /api/gemini/suggest-courses

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

app.use((req, _res, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;
