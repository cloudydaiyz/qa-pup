```ts
// === Environment Variables for all packages ===

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_ACCESS_SECRET = process.env.AWS_ACCESS_SECRET;
export const AWS_REGION = process.env.AWS_REGION; // "us-east-2";

export const DB_URI = process.env.DB_URI; // "mongodb://localhost:27017";
export const DB_USER = process.env.DB_USER; // "root";
export const DB_PASS = process.env.DB_PASS; // "password";
export const DB_NAME = process.env.DB_NAME; // (optional) "testData";

// === Environment Variables for container ===

export const TEST_CODE_BUCKET = process.env.TEST_CODE_BUCKET; // "qa-pup-example-input";
export const TEST_CODE_FILE = process.env.TEST_CODE_FILE; // "example.spec.ts";
export const TEST_OUTPUT_BUCKET = process.env.TEST_OUTPUT_BUCKET; // "qa-pup-example-output";
export const TEST_DESCRIPTION = "Example test file for QA-PUP";
export const RUN_ID = process.env.RUN_ID; // "runidexample12345"; // stringified run id

// === Environment Variables for test completion lambda ===

export const SENDER_EMAIL = process.env.SENDER_EMAIL;
```