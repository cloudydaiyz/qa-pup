import assert from "assert";

export const AWS_REGION = process.env.AWS_REGION; // "us-east-2";
export const TEST_CODE_BUCKET = process.env.TEST_CODE_BUCKET; // "qa-pup-example-input";
export const TEST_CODE_FILE = process.env.TEST_CODE_FILE; // "example.spec.ts";
export const TEST_OUTPUT_BUCKET = process.env.TEST_OUTPUT_BUCKET; // "qa-pup-example-output";
// export const TEST_DESCRIPTION = "Example test file for QA-PUP";
export const RUN_ID = process.env.RUN_ID; // "runidexample12345"; // stringified run id

assert(TEST_CODE_FILE && TEST_CODE_BUCKET 
    && TEST_OUTPUT_BUCKET && AWS_REGION && RUN_ID, 
    "Invalid command line arguments");

export const TEST_CODE = TEST_CODE_FILE.replaceAll(/(\s|\.)+/g, "-");