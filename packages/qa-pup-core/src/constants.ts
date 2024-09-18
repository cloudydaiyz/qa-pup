import assert from "assert";

// == Constants == //

export const FULL_HOUR = 60 * 60 * 1000;
export const FULL_DAY = 24 * FULL_HOUR;
export const MAX_DAILY_MANUAL_TESTS = 3;
export const DB_NAME = "testData";

// == Environment variables == //

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID!;
const AWS_ACCESS_SECRET = process.env.AWS_SECRET_ACCESS_KEY!;
const AWS_REGION = process.env.AWS_REGION!;
export const MONGODB_URI = process.env.MONGODB_URI!;
export const MONGODB_USER = process.env.MONGODB_USER!;
export const MONGODB_PASS = process.env.MONGODB_PASS!;

export const RAW_TEST_LIFETIME = process.env.TEST_LIFETIME;
export const ECS_CLUSTER_NAME = process.env.ECS_CLUSTER_NAME;
export const ECS_TASK_DEFINITION_NAME = process.env.ECS_TASK_DEFINITION_NAME;
export const TEST_INPUT_BUCKET = process.env.TEST_INPUT_BUCKET;
export const SENDER_EMAIL = process.env.SENDER_EMAIL!;

const requiredCmdLineArgs = [AWS_ACCESS_KEY, AWS_ACCESS_SECRET, AWS_REGION, MONGODB_URI, MONGODB_USER, MONGODB_PASS];

assert(requiredCmdLineArgs.every((arg) => arg), "Invalid command line arguments");