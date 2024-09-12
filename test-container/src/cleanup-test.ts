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

// === test-results.json Schema ===

export interface TestResultsJson {
	suites: {
		title: string;
		specs: TestSpecs[]; // top level tests
		suites: { // multiple test suites
			title: string,
			specs: TestSpecs[] // tests for a specific test suite
		}[];
	}[];

	stats: {
		startTime: string, // overall start time
		duration: number // overall duration
	};
}

export interface TestSpecs { // usually one for each project and test
	title: string,
	file: string,
	tests: { // usually only one member
		projectName: string,
		results: { // usually only one member
			startTime: string,
			duration: number,
			status: string,
			attachments: { // test can have multiple attachments
				name: string,
				contentType: string,
				path: string
			}[];
		}[];
	}[];
}

async function readResults() {
    const data = fs.readFileSync('./playwright-report/test-results.json');
    const obj = JSON.parse(data.toString()) as TestResultsJson;
    console.log(obj.suites[0].title);
    console.log(obj.suites[0].specs[0].title);
    console.log(obj.suites[0].specs[0].tests[0].projectName);
    console.log(obj.suites[0].specs[0].tests[0].results[0].status);
    console.log(obj.suites[0].specs[0].tests[0].results[0].duration);
    console.log(obj.suites[0].specs[0].tests[0].results[0].startTime);
    console.log(obj.suites[0].specs[0].tests[0].results[0].attachments[0].name);
    console.log(obj.suites[0].specs[0].tests[0].results[0].attachments[0].contentType);
    console.log(obj.suites[0].specs[0].tests[0].results[0].attachments[0].path);
    console.log(obj.stats.startTime);
    console.log(obj.stats.duration);

    // const d2 = fs.readdirSync('./playwright-report/data');
    // console.log(d2);
}

// Useful for the frontend
async function readDataFromBucket() {
    fetch(`https://${BUCKET}.s3.${REGION}.amazonaws.com/qa-pup-example.spec.ts`)
        .then(res => res.text())
        .then(txt => console.log(txt));
    
    // use <a download="filename" href="s3link"> for downloading
}

// Put reporters and test assets into S3 bucket, and update the MongoDB database
async function cleanup() {
    console.log('Begin cleanup...');

    // Put index.html and test-results.json into the bucket
    const index = fs.readFileSync('./playwright-report/index.html');
    const testResults = fs.readFileSync('./playwright-report/test-results.json');
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
    let endTime = new Date(0); // latest end time + duration
    let testsRan = 0;
    let testsPassed = 0;
    
    // Puts the test assets from test-results.json into the bucket for a single test
    const updateTestData = async (spec: TestSpecs, testSuiteName?: string) => {
        const testBrowser = spec.tests[0].projectName;
        const testName = spec.title.replace(/\s+/, "-") + "-" + testBrowser;

        // Put the video asset into the bucket
        const vidLocalPath = spec.tests[0].results[0].attachments[0].path;
        const vidData = fs.readFileSync(vidLocalPath);
        const putVid = new PutObjectCommand({
            Bucket: BUCKET,
            Key: `${RUN_ID}/${TEST_CODE_FILE}/${testName}`,
            Body: vidData,
        });
        const response = await client.send(putVid);
        assert(response.ETag, "Invalid response");

        // Obtain storage data for MongoDB
        const testStartTime = new Date(spec.tests[0].results[0].startTime);
        const testDuration = spec.tests[0].results[0].duration;
        const testStatus = spec.tests[0].results[0].status.toUpperCase();
        const testVidName = "video";
        const testVidObjUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${RUN_ID}/${TEST_CODE_FILE}/${testName}`;

        // Update overall test statistics
        const testEndTime = new Date(testStartTime.getTime() + testDuration);
        if(testStartTime < startTime) startTime = testStartTime;
        if(testEndTime > endTime) endTime = testEndTime;
        if(testStatus == "PASSED") testsPassed++;
        testsRan++;
    }

    // Update the test data of tests in suites and outside of suites
    const testData = JSON.parse(testResults.toString()) as TestResultsJson;
    for(const spec of testData.suites[0].specs) updateTestData(spec);
    for(const suite of testData.suites[0].suites) {
        for(const spec of suite.specs) {
            updateTestData(spec, suite.title.replace(/\s+/, "-"));
        }
    }

    // Compute overall test statistics from file
    const duration = endTime.getTime() - startTime.getTime();
    const status = testsRan == testsPassed ? "PASSED" : "FAILED";

    // TODO: Store corresponding test data in MongoDB
    const indexUrl = `https://${BUCKET}.s3-website.${REGION}.amazonaws.com/${RUN_ID}/${TEST_CODE_FILE}/index.html`;
    const testResultsObjUrl = `https://${BUCKET}.s3-website.${REGION}.amazonaws.com/${RUN_ID}/${TEST_CODE_FILE}/test-results.json`;

    console.log('Cleanup complete!');
}

// cleanup();
readResults();