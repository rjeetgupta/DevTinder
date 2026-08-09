declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            PORT: string;

            MONGODB_URI: string;
            DB_NAME: string;

            JWT_SECRET: string;
            JWT_EXPIRY: string;

            FRONTEND_URL: string;
            CORS_ORIGIN: string;

            EMAIL_USER: string;
            EMAIL_PASS: string;

            AWS_REGION: string;
            AWS_ACCESS_KEY: string;
            AWS_SECRET_KEY: string;
            AWS_BUCKET_NAME: string;

            RAZORPAY_KEY_ID: string;
            RAZORPAY_KEY_SECRET: string;
            RAZORPAY_WEBHOOK_SECRET: string;

            GEMINI_API_KEY: string;
        }
    }
}

export {};
