// Runs once when the function is deployed to setup the system
// Overwrites any existing data in the database and S3

import { PupCore } from "@cloudydaiyz/qa-pup-core";
import { isEmailVerified, sendVerificationEmail } from "@cloudydaiyz/qa-pup-core/cloud";
import { DeleteObjectsCommand, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { LambdaDefaultReturn } from "./types.js";

const pupCore = new PupCore();

export const handler = async (): Promise<LambdaDefaultReturn> => {
    
    try {
        await pupCore.connection;

        // Initialize database index (helps with finding dashboard vs test files)
        await pupCore.testRunColl.createIndex({ docType: 1, runId: 1, name: 1 });
        await pupCore.testMetadataColl.createIndex({ testRunFileId: 1, testName: 1 });

        // Initialize Database singleton element in database
        await pupCore.testRunColl.updateOne(
            { docType: "DASHBOARD" },
            {
                $set: {
                    runId: "N/A",
                    runType: "MANUAL",
                    startTime: new Date(),
                    latestTests: [],
                    manualRun: {
                        remaining: 3,
                        max: 3,
                        nextRefresh: new Date(Date.now() + 1000 * 60 * 60 * 24),
                    },
                    nextScheduledRun: {
                        startTime: new Date(),
                        emailList: []
                    },
                    currentRun: {
                        state: "AT REST",
                        emailList: []
                    }
                }
            },
            { upsert: true }
        );

        // Remove all preexisting test files and metadata from the database
        await pupCore.testRunColl.deleteMany({ docType: "TEST_RUN_FILE" });
        await pupCore.testMetadataColl.deleteMany({});

        // Remove all preexisting data from the S3 bucket
        const s3Client = new S3Client();
        const objects = await s3Client.send(new ListObjectsCommand({ Bucket: process.env.TEST_OUTPUT_BUCKET! }));
        if(objects.Contents && objects.Contents?.length > 0) {
            const objectKeys = objects.Contents?.map(obj => { return { Key: obj.Key } })

            await s3Client.send(new DeleteObjectsCommand({
                Bucket: process.env.TEST_OUTPUT_BUCKET!,
                Delete: { Objects: objectKeys }
            }));
        }
        
        // Send verification email to main sender email if it's not already verified in SES
        if(!isEmailVerified(process.env.SENDER_EMAIL!)) await sendVerificationEmail(process.env.SENDER_EMAIL!);
        console.log("System configured successfully");
    } catch(e) {
        
        console.log("System improperly configured");
        console.log(e);
        return { statusCode: 400, body: JSON.stringify({ message: "System improperly configured" }) };
    }
    return { statusCode: 200, body: JSON.stringify({ message: "System configured successfully" }) };
}