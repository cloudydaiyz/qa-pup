// Runs once when the function is deployed to setup the system

import { PupCore } from "@cloudydaiyz/qa-pup-core";
import { sendVerificationEmail } from "@cloudydaiyz/qa-pup-core/cloud";

const pupCore = new PupCore();

export const handler = async () => {
    
    try {
        await pupCore.connection;

        // Initialize database index (helps with finding dashboard vs test files)
        await pupCore.testRunColl.createIndex({ docType: 1, runId: 1, name: 1 });

        // Initialize Database singleton element in database
        await pupCore.testRunColl.updateOne(
            { docType: "DASHBOARD" },
            {
                runId: "N/A",
                runType: "MANUAL",
                startTime: new Date(),
                latestTests: [],
                manualRun: {
                    remaining: 3,
                    max: 3,
                    nextRefresh: new Date(Date.now() + + 1000 * 60 * 60 * 24),
                },
                nextScheduledRun: {
                    startTime: new Date(),
                    emailList: []
                },
                currentRun: {
                    state: "AT REST"
                }
            },
            { upsert: true }
        );

        // Send verification email to main sender email
        await sendVerificationEmail(process.env.SENDER_EMAIL!);
    } catch(e) {
        
        console.log("System improperly configured");
        return { statusCode: 200, body: JSON.stringify((e as Error).message) };
    }
    
    return { statusCode: 200 };
}