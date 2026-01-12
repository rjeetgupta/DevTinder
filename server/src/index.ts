import { config } from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

config({ path: "./.env" });

const PORT: number = Number(process.env.PORT) || 4000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup error:", error);
        process.exit(1);
    }
};

startServer();