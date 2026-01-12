import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const uri = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;

        if (!uri) {
            throw new Error("MongoDB URI is missing in environment variables");
        }

        await mongoose.connect(uri);
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
