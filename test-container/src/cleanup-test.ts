import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { RunStatus, TestAsset, TestMetadataSchema, TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";
import assert from "assert";
import fs from "fs";
import mime from "mime-types";

import { AWS_REGION, TEST_INPUT_BUCKET, TEST_OUTPUT_BUCKET, TEST_FILE, RUN_ID, TEST_FILE_ID } from "./constants";
import { PupService } from "@cloudydaiyz/qa-pup-core";


// === test-results.json Schema ===

export interface TestResultsJson {
    suites: { // usually only one member
        title: string; // file name
        specs: TestSpecs[]; // top level tests
        suites?: { // multiple test suites
            title: string, // suite name
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

// Useful for the frontend
async function readDataFromBucket() {
    fetch(`https://${TEST_OUTPUT_BUCKET}.s3.${AWS_REGION}.amazonaws.com/qa-pup-example.spec.ts`)
        .then(res => res.text())
        .then(txt => console.log(txt));
    
    // use <a download="filename" href="s3link"> for downloading
}

// Put reporters and test assets into S3 bucket, and update the MongoDB database
// NOTE: Come back to this and update with better async/await usage
async function cleanup() {
    console.log('Begin cleanup');

    // Put index.html and test-results.json into the bucket
    console.log('Storing test artifacts...');
    const index = fs.readFileSync('./playwright-report/index.html');
    const testResults = fs.readFileSync('./playwright-report/test-results.json');
    const client = new S3Client();

    const putIndex = new PutObjectCommand({
        Bucket: TEST_OUTPUT_BUCKET,
        Key: `${RUN_ID}/${TEST_FILE_ID}/index.html`,
        ContentType: "text/html",
        Body: index
    });
    const response1 = await client.send(putIndex);
    assert(response1.ETag, "Invalid response");

    const putTestResults = new PutObjectCommand({
        Bucket: TEST_OUTPUT_BUCKET,
        Key: `${RUN_ID}/${TEST_FILE_ID}/test-results.json`,
        ContentType: "application/json",
        Body: testResults,
    });
    const response2 = await client.send(putTestResults);
    assert(response2.ETag, "Invalid response");

    // Put the files in the data folder into the bucket
    const dataFiles = fs.readdirSync('./playwright-report/data');
    for(const file of dataFiles) {
        const data = fs.readFileSync(`./playwright-report/data/${file}`);
        const putData = new PutObjectCommand({
            Bucket: TEST_OUTPUT_BUCKET,
            Key: `${RUN_ID}/${TEST_FILE_ID}/data/${file}`,
            Body: data,
        });
        const response = await client.send(putData);
        assert(response.ETag, "Invalid response");
    }

    // Init overall test statistics from file
    const testData = JSON.parse(testResults.toString()) as TestResultsJson;
    const startTime = new Date(testData.stats.startTime); // earliest start time
    const duration = testData.stats.duration; // latest end time + duration
    let testsRan = 0;
    let testsPassed = 0;
    
    // Puts the test assets from test-results.json into the bucket for a single test
    const testMetadata: TestMetadataSchema[] = [];
    const updateTestData = async (spec: TestSpecs, testSuiteName?: string) => {
        const testBrowser = spec.tests[0].projectName;
        const testName = spec.title.replaceAll(/(\s|\.)+/g, "-") + "-" + testBrowser;

        // Put the video asset into the bucket
        const assets: TestAsset[] = [];
        const assetOperations: Promise<void>[] = [];
        spec.tests[0].results[0].attachments.forEach(async (attachment, index) => {
            const vidLocalPath = attachment.path;
            const vidMimeExt = mime.extension(attachment.contentType);
            const vidFileName = `${testName}-${attachment.name}-${index}.${vidMimeExt}`;

            const vidData = fs.readFileSync(vidLocalPath);
            const putVid = new PutObjectCommand({
                Bucket: TEST_OUTPUT_BUCKET,
                Key: `${RUN_ID}/${TEST_FILE_ID}/${vidFileName}`,
                ContentType: attachment.contentType,
                Body: vidData,
            });
            console.log(attachment.contentType);

            const testVidObjUrl = `https://${TEST_OUTPUT_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${RUN_ID}/${TEST_FILE_ID}/${vidFileName}`;
            const putVidOp = client.send(putVid)
                .then(response => {
                    assert(response.ETag, "Invalid response");
                    assets.push({ name: `${testName}-${attachment.name}-${index}`, objectUrl: testVidObjUrl });
                });
            assetOperations.push(putVidOp);
            console.log(testVidObjUrl);
        });
        await Promise.all(assetOperations);

        // Obtain storage data for MongoDB
        const testStatus = spec.tests[0].results[0].status.toUpperCase() as RunStatus;
        testMetadata.push({
            testName: testName,
            suiteName: testSuiteName,
            startTime: new Date(spec.tests[0].results[0].startTime),
            duration: spec.tests[0].results[0].duration,
            status: testStatus,
            assets: assets
        });

        // Update overall test statistics
        if(testStatus == "PASSED") testsPassed++;
        testsRan++;
    }

    // Update the test data of tests in suites and outside of suites
    console.log("Updating test data...");
    for(const spec of testData.suites[0].specs) await updateTestData(spec);
    if(testData.suites[0].suites) {
        for(const suite of testData.suites[0].suites) {
            for(const spec of suite.specs) {
                await updateTestData(spec, suite.title.replaceAll(/(\s|\.)+/g, "-"));
            }
        }
    }

    // Compute overall test statistics from file
    const status = testsRan == testsPassed ? "PASSED" : "FAILED";

    // Store corresponding test data in MongoDB
    console.log("Sending test results to database...");
    
    const indexUrl = `http://${TEST_OUTPUT_BUCKET}.s3-website.${AWS_REGION}.amazonaws.com/${RUN_ID}/${TEST_FILE_ID}/index.html`;
    const testResultsObjUrl = `https://${TEST_OUTPUT_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${RUN_ID}/${TEST_FILE_ID}/test-results.json`;
    const testRunFile: TestRunFileSchema = {
        docType: "TEST_RUN_FILE",
        name: TEST_FILE_ID,
        duration: duration,
        status: status,
        runId: RUN_ID,
        startTime: startTime,
        testsRan: testsRan,
        testsPassed: testsPassed,
        tests: testMetadata,
        sourceObjectUrl: `https://${TEST_INPUT_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${TEST_FILE}`,
        reporters: {
            htmlStaticUrl: indexUrl,
            jsonObjectUrl: testResultsObjUrl
        }
    };
    const service = new PupService();
    await service.addTestRunFile(testRunFile);
    service.client.close();

    console.log('Cleanup complete!');
}

cleanup();