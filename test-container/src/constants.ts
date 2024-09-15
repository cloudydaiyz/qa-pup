import assert from "assert";

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_ACCESS_SECRET = process.env.AWS_ACCESS_SECRET;
export const AWS_REGION = process.env.AWS_REGION; // "us-east-2";

export const TEST_CODE_BUCKET = process.env.TEST_CODE_BUCKET; // "qa-pup-example-input";
export const TEST_CODE_FILE = process.env.TEST_CODE_FILE; // "example.spec.ts";
export const TEST_OUTPUT_BUCKET = process.env.TEST_OUTPUT_BUCKET; // "qa-pup-example-output";
export const RUN_ID = process.env.RUN_ID; // "runidexample12345"; // stringified run id

export const DB_URI = process.env.DB_URI; // "mongodb://localhost:27017";
export const DB_USER = process.env.DB_USER; // "root";
export const DB_PASS = process.env.DB_PASS; // "password";

assert(TEST_CODE_FILE && TEST_CODE_BUCKET && TEST_OUTPUT_BUCKET && RUN_ID 
    && AWS_REGION && AWS_ACCESS_KEY && AWS_ACCESS_SECRET 
    && DB_URI && DB_USER && DB_PASS, 
    "Invalid command line arguments");

export const TEST_CODE = TEST_CODE_FILE.replaceAll(/(\s|\.)+/g, "-");