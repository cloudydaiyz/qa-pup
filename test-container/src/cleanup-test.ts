// export assets to test-artifacts bucket

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import assert from "assert";
import fs from "fs";

// const artifactsBucket = process.env.TEST_ARTIFACTS_BUCKET;
const file = "qa-pup-example.spec.ts";
const runId = "runidexample12345"

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
async function cleanupSample() {
    // assert(artifactsBucket, 'TEST_ARTIFACTS_BUCKET is required');
    const client = new S3Client({ region: "us-east-1" });
    const data = fs.readFileSync('./write-example/Auto-Scaling-Lab.yaml');
    console.log(data.toString());

    console.log('cleaning');
    const command = new PutObjectCommand({
        Bucket: "cloudydaze-output-bucket",
        Key: "EC2-Auto-Scaling-Lab.yaml",
        Body: data
    });
    const response = await client.send(command);
    assert(response.ETag, "No response body");
    console.log(await response.ETag);

    const command2 = new GetObjectCommand({
        Bucket: "cloudydaze-output-bucket",
        Key: "EC2-Auto-Scaling-Lab.yaml",
    });
    const response2 = await client.send(command2);
    assert(response2.Body, "No response body");
    const response2String = await response2.Body.transformToString();
    console.log(response2String);
    
    // Assert that the two are the same
    console.log(data.toString() == response2String);
}

async function readResults() {
    const data = fs.readFileSync('./playwright-report/test-results.json');
    const obj = JSON.parse(data.toString());
    console.log(obj.suites[0].specs[0].tests[0].results[0].status);
    console.log(obj.suites[0].specs[0].tests[0].results[0].duration);
    console.log(obj.suites[0].specs[0].tests[0].results[0].startTime);
    console.log(obj.suites[0].specs[0].tests[0].results[0].attachments[1].name);
    console.log(obj.suites[0].specs[0].tests[0].results[0].attachments[1].contentType);
    console.log(obj.suites[0].specs[0].tests[0].results[0].attachments[1].path);

    // const d2 = fs.readdirSync('./playwright-report', { recursive: true });
    // console.log(d2);
}

async function cleanup() {
    
}

// cleanupSample();
readResults();
// cleanup();