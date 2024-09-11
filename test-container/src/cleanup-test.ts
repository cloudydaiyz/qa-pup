// export assets to test-artifacts bucket

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import assert from "assert";
import fs from "fs";

// const artifactsBucket = process.env.TEST_ARTIFACTS_BUCKET;
const client = new S3Client({ region: "us-east-1" });

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
async function cleanupSample() {
    // assert(artifactsBucket, 'TEST_ARTIFACTS_BUCKET is required');
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

async function cleanup() {
    
}

cleanupSample();
// cleanup();