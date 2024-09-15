import assert from "assert";

export const FULL_HOUR = 60 * 60 * 1000;
export const FULL_DAY = 24 * FULL_HOUR;
export const TEST_LIFETIME = 7 * FULL_DAY;

export const MAX_DAILY_MANUAL_TESTS = 3;

export const DB_NAME = "testData";

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_ACCESS_SECRET = process.env.AWS_ACCESS_SECRET;
export const AWS_REGION = process.env.AWS_REGION; // "us-east-2";

export const DB_URI = process.env.DB_URI; // "mongodb://localhost:27017";
export const DB_USER = process.env.DB_USER; // "root";
export const DB_PASS = process.env.DB_PASS; // "password";

assert(AWS_REGION && AWS_ACCESS_KEY && AWS_ACCESS_SECRET 
    && DB_URI && DB_USER && DB_PASS, 
    "Invalid command line arguments");

export const AWS_CONFIG = { region: AWS_REGION, credentials: { accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_ACCESS_SECRET } }