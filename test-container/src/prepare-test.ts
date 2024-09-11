// import tests from S3 bucket into the ./tests folder

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import assert from "assert";
import fs from "fs";

// const codeBucket = process.env.TEST_CODE_BUCKET;
const client = new S3Client({ region: "us-east-1" });

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
async function prepareSample() {
    // assert(codeBucket, 'TEST_CODE_BUCKET is required');
        
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
    
}

prepareSample();
// prepare();