// import tests from S3 bucket into the ./tests folder

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import assert from "assert";
import fs from "fs";

// const codeBucket = process.env.TEST_CODE_BUCKET;
const file = "qa-pup-example.spec.ts";

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
async function prepareSample() {
    // assert(codeBucket, 'TEST_CODE_BUCKET is required');
    const client = new S3Client({ region: "us-east-1" });
    console.log('preparing');
    const command = new GetObjectCommand({
        Bucket: "cf-templates-jy2ivedl9rti-us-east-1",
        Key: "2024-06-10T203259.224Z9fz-EC2-Auto-Scaling-Lab.yaml"
    });
    const response = await client.send(command);
    assert(response.Body, "No response body");
    // console.log(await response.Body.transformToString());
    fs.mkdirSync('./write-example', { recursive: true });
    fs.writeFileSync('./write-example/Auto-Scaling-Lab.yaml', await response.Body.transformToByteArray(), {flag: 'w'});
}

async function prepare() {
    console.log('preparing');
    const client = new S3Client();
    const command = new GetObjectCommand({
        Bucket: "qa-pup-example-input",
        Key: file
    });
    const response = await client.send(command);
    assert(response.Body, "No response body");
    const fileStr = await response.Body.transformToString();
    console.log(fileStr);
    fs.mkdirSync('./tests', { recursive: true });
    fs.writeFileSync('./tests/' + file, fileStr);
}

// prepareSample();
prepare();