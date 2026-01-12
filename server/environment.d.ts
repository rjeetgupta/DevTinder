declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string;
            DB_NAME: string;

            ACCESS_TOKEN_SECRET: string;
            ACCESS_TOKEN_EXPIRY: string;
            REFRESH_TOKEN_SECRET: string;
            REFRESH_TOKEN_EXPIRY: string;
        }
    }
}

export { };
