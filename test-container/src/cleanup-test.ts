// export assets to test-artifacts bucket

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import assert from "assert";
import fs from "fs";

// const artifactsBucket = process.env.TEST_ARTIFACTS_BUCKET;
const file = "qa-pup-example.spec.ts";

const TEST_CODE_FILE = "qa-pup-example-spec-ts";
const TEST_DESCRIPTION = "Example test file for QA-PUP";
const BUCKET = "qa-pup-example-input";
const REGION = "us-east-2";
const RUN_ID = "runidexample12345"; // stringified run id

// Useful for the frontend
async function readDataFromBucket() {
    fetch(`https://${BUCKET}.s3.${REGION}.amazonaws.com/qa-pup-example.spec.ts`)
        .then(res => res.text())
        .then(txt => console.log(txt));
    
    // use <a download="filename" href="s3link"> for downloading
}

async function buffExample() {
    const buff = fs.readFileSync('./playwright-report/index.html');
    buff.toString();
    console.log("boom");
    buff.toString();
    console.log("boom");
    buff.toString();
    console.log("boom");
}

// Put reporters and test assets into S3 bucket, and update the MongoDB database
async function cleanup() {
    console.log('Begin cleanup...');

    // Put index.html and test-results.json into the bucket
    const index = fs.readFileSync('./playwright-report/index.html');
    const indexUrl = `https://${BUCKET}.s3-website.${REGION}.amazonaws.com/${RUN_ID}/${TEST_CODE_FILE}/index.html`;
    const testResults = fs.readFileSync('./playwright-report/test-results.json');
    const testResultsObjUrl = `https://${BUCKET}.s3-website.${REGION}.amazonaws.com/${RUN_ID}/${TEST_CODE_FILE}/test-results.json`;

    const client = new S3Client({ region: REGION });
    const putIndex = new PutObjectCommand({
        Bucket: BUCKET,
        Key: `${RUN_ID}/${TEST_CODE_FILE}/index.html`,
        Body: index
    });
    const response1 = await client.send(putIndex);
    assert(response1.ETag, "Invalid response");

    const putTestResults = new PutObjectCommand({
        Bucket: BUCKET,
        Key: `${RUN_ID}/${TEST_CODE_FILE}/test-results.json`,
        Body: testResults,
    });
    const response2 = await client.send(putTestResults);
    assert(response2.ETag, "Invalid response");

    // Put the files in the data folder into the bucket
    const dataFiles = fs.readdirSync('./playwright-report/data');
    for(const file of dataFiles) {
        const data = fs.readFileSync(`./playwright-report/data/${file}`);
        const putData = new PutObjectCommand({
            Bucket: BUCKET,
            Key: `${RUN_ID}/${TEST_CODE_FILE}/data/${file}`,
            Body: data,
        });
        const response = await client.send(putData);
        assert(response.ETag, "Invalid response");
    }

    // Init overall test statistics from file
    let startTime = new Date(); // earliest start time
    let endTime = new Date(); // latest end time
    let testsRan = 0;
    let testsPassed = 0;

    // Put the test assets from test-results.json into the bucket
    const testData = JSON.parse(testResults.toString());
    for(const spec of testData.suites[0].specs) {
        const name = spec.title.replace(/\s+/, "-");
        const vidLocalPath = spec.tests[0].results[0].attachments[0].path;

        const vidData = fs.readFileSync(vidLocalPath);
        const putVid = new PutObjectCommand({
            Bucket: BUCKET,
            Key: `${RUN_ID}/${TEST_CODE_FILE}/${name}`,
            Body: vidData,
        });
        const response = await client.send(putVid);
        assert(response.ETag, "Invalid response");

        // Obtain data for storage
        const vidName = "video";
        const vidObjUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${RUN_ID}/${TEST_CODE_FILE}/${name}`;
    }

    // Compute overall test statistics from file
    const duration = endTime.getTime() - startTime.getTime();
    const status = testsRan == testsPassed ? "PASS" : "FAILED";

    // TODO: Store corresponding test data in MongoDB

    console.log('Cleanup complete!');
}

buffExample();
// cleanup();