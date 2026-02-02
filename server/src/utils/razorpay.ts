import { config } from "dotenv";
import Razorpay from "razorpay";

config({
    path: "./.env"
})

let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default instance;