import assert from "assert";

export const FULL_HOUR = 60 * 60 * 1000;
export const FULL_DAY = 24 * FULL_HOUR;
export const MAX_DAILY_MANUAL_TESTS = 3;
export const DB_NAME = "testData";

export const RAW_TEST_LIFETIME = process.env.TEST_LIFETIME;
export const AWS_REGION = process.env.AWS_REGION || "us-east-2";
export const MONGODB_URI = process.env.MONGODB_URI;
export const MONGODB_USER = process.env.MONGODB_USER;
export const MONGODB_PASS = process.env.MONGODB_PASS;

const cmdLineArgs = [RAW_TEST_LIFETIME, AWS_REGION, MONGODB_URI, MONGODB_USER, MONGODB_PASS];

assert(cmdLineArgs.every((arg) => arg), "Invalid command line arguments");

export const TEST_LIFETIME = Number(RAW_TEST_LIFETIME);