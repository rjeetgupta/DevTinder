import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";


dotenv.config({
    path: "./.env"
});

const port = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        })
    } catch (error) {
        console.log("Server connection error !!", error)
        process.exit(1)
    }
}

startServer();