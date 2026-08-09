import { config } from "dotenv";
config({ path: "./.env" });

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./utils/socket.js";
import "./crons/expireMembership.job.js";

const PORT: number = Number(process.env.PORT) || 7777;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        console.log("Database connected successfully");

        const server = http.createServer(app);
        initializeSocket(server);

        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup error:", error);
        process.exit(1);
    }
};

startServer();
