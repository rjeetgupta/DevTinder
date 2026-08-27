import { config } from "dotenv";
config({ path: "./.env" });

import http from "http";
import https from "node:https";
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

        if (process.env.NODE_ENV === "production") {
            setInterval(() => {
              https
                .get("https://devtinder-h1ly.onrender.com/health", (res) => {
                  console.log("Pinged server", res.statusCode);
                })
                .on("error", (e) => {
                  console.log("Ping Error", e.message);
                });
            }, 14 * 60 * 1000);
        }
    } catch (error) {
        console.error("Server startup error:", error);
        process.exit(1);
    }
};

startServer();
