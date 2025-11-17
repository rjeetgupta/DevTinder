import mongoose from "mongoose";


const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`);
        console.log(`MongoDB connected !!`)
    } catch (error) {
        console.log("MongoDB connection error !!", error)
        process.exit(1)
    }
}

export default connectDB;