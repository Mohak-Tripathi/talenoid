declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string;
        JWT_EXPIRES_TIME: string;
        PORT: string;
        DB_LOCAL_URI: string;
        DB_URI: string;
        NODE_ENV: string;
        COOKIE_EXPIRES_TIME: string;
        // Add other environment variables if needed
    }
}


