import assert from "assert";


export const TEST_INPUT_BUCKET = process.env.TEST_INPUT_BUCKET; // "qa-pup-example-input";
export const TEST_FILE = process.env.TEST_FILE!; // "example.spec.ts";
export const TEST_OUTPUT_BUCKET = process.env.TEST_OUTPUT_BUCKET; // "qa-pup-example-output";
export const RUN_ID = process.env.RUN_ID!; // "runidexample12345"; // stringified run id
export const AWS_REGION = process.env.AWS_REGION;

// Also must be defined for qa-pup-core:
// const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
// const AWS_ACCESS_SECRET = process.env.AWS_SECRET_ACCESS_KEY;
// const MONGODB_URI = process.env.MONGODB_URI;
// const MONGODB_USER = process.env.MONGODB_USER;
// const MONGODB_PASS = process.env.MONGODB_PASS;

const requiredCmdLineArgs = [AWS_REGION, TEST_INPUT_BUCKET, TEST_FILE, TEST_OUTPUT_BUCKET, RUN_ID];

console.log(requiredCmdLineArgs);
assert(requiredCmdLineArgs.every((arg) => arg), "Invalid command line arguments");

export const TEST_FILE_ID = TEST_FILE.replaceAll(/(\s|\.)+/g, "-");