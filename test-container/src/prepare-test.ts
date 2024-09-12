import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import assert from "assert";
import fs from "fs";

import { AWS_REGION, TEST_CODE_BUCKET, TEST_CODE_FILE } from "./constants";


async function prepare() {
    console.log('Preparing test...');

    // Obtain test code file from S3 bucket
    const client = new S3Client({ region: AWS_REGION });
    const command = new GetObjectCommand({
        Bucket: TEST_CODE_BUCKET,
        Key: TEST_CODE_FILE
    });
    const response = await client.send(command);
    assert(response.Body, "No response body");

    // Import tests from S3 bucket into the ./tests folder
    const fileStr = await response.Body.transformToByteArray();
    fs.mkdirSync('./tests', { recursive: true });
    fs.writeFileSync('./tests/' + TEST_CODE_FILE, fileStr);

    console.log('Test setup successful!');
}

prepare();