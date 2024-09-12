// import tests from S3 bucket into the ./tests folder

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import assert from "assert";
import fs from "fs";

// const codeBucket = process.env.TEST_CODE_BUCKET;
// const codeFile = process.env.TEST_CODE_FILE;

// NOTE: file name must be formatted, e.g. `example-spec-ts` for `example.spec.ts`
const TEST_CODE_FILE = "qa-pup-example-spec-ts";
const REGION = "us-east-2";
const BUCKET = "qa-pup-example-input";

async function prepare() {
    console.log('Preparing test...');
    assert(TEST_CODE_FILE, "No file name specified, unable to prepare test");

    // TODO: Obtain test code file from S3 bucket
    const client = new S3Client({ region: REGION });
    const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: TEST_CODE_FILE
    });
    const response = await client.send(command);
    assert(response.Body, "No response body");

    const fileStr = await response.Body.transformToByteArray();
    fs.mkdirSync('./tests', { recursive: true });
    fs.writeFileSync('./tests/' + TEST_CODE_FILE, fileStr);

    console.log('Test setup successful!');
}

prepare();