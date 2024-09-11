import { DashboardSchema, RunState, RunType, TestRunFileSchema, TestRunSchema } from "@cloudydaiyz/qa-pup-types";
import assert from "assert";
import { Collection, MongoClient, ObjectId, UpdateResult, WithId } from "mongodb";
import { COLL_NAME, DB_NAME, FULL_DAY, MAX_DAILY_MANUAL_TESTS } from "./constants";

export class PupCore {
    client: MongoClient;
    coll: Collection<TestRunSchema | DashboardSchema | TestRunFileSchema>;
    connection: Promise<MongoClient>;
    
    constructor(uri: string) {
        this.client = new MongoClient(uri);
        this.coll = this.client.db(DB_NAME).collection(COLL_NAME);
        this.connection = this.client.connect();
    }

    public async readDashboardInfo(): Promise<DashboardSchema> {
        let dashboard = await this.coll.findOne({ docType: "DASHBOARD" }) as DashboardSchema;
        if(!dashboard) {
            dashboard = {
                docType: "DASHBOARD",
                runId: new ObjectId(),
                runType: "SCHEDULED",
                startTime: new Date(),
                latestTests: [],
                manualRun: {
                    remaining: MAX_DAILY_MANUAL_TESTS,
                    max: MAX_DAILY_MANUAL_TESTS,
                    nextRefresh: new Date()
                },
                nextScheduledRun: {
                    startTime: new Date(),
                    emailList: []
                },
                currentRun: {
                    state: "AT REST",
                }
            };

            // Insert the new dashboard and ensure it was successful
            const insertResult = await this.coll.insertOne(dashboard);
            assert(insertResult.acknowledged);
        }
        return dashboard;
    }
    
    public async readLatestTestInfo(runId: ObjectId, name: string): Promise<TestRunFileSchema> {
        const testInfo = await this.coll.findOne(
            { docType: "TEST_RUN_FILE", runId, name }
        ) as TestRunFileSchema;
        assert(testInfo);
        return testInfo;
    }
    
    public async triggerRun(runType: RunType, email?: string): Promise<void> {

        let emailList = email ? [ email ] : [];
        if(runType == "SCHEDULED") {
            const dashboard = await this.coll.findOne({ docType: "DASHBOARD" }) as DashboardSchema;
            assert(dashboard);

            emailList = dashboard.nextScheduledRun.emailList;
        }

        await this.coll.updateOne({ docType: "DASHBOARD" }, {
            $set: {
                currentRun: {
                    state: "RUNNING",
                    runType: runType,
                    runId: new ObjectId(),
                    startTime: new Date(),
                    emailList: emailList
                }
            }
        });

        // Start the test runs in the kubernetes cluster

    }

    public async addToEmailList(email: string, current?: boolean): Promise<void> {
        let update: UpdateResult;
        if(current) {

            // Add the email to the list of emails to be notified for the current run 
            // if the max number of emails has not been reached
            update = await this.coll.updateOne(
                { docType: "DASHBOARD", "currentRun.status": "RUNNING", "currentRun.emailList": { $size: { $lt: 10 } } }, 
                { $addToSet: { emailList: email } }
            );
        } else {

            // Add the email to the list of emails to be notified for the next scheduled run 
            // if the max number of emails has not been reached
            update = await this.coll.updateOne(
                { docType: "DASHBOARD", "nextScheduledRun.emailList": { $size: { $lt: 10 } } }, 
                { $addToSet: { "nextScheduledRun.emailList": email } }
            );
        }
        assert(update.acknowledged && update.matchedCount == 1 && update.modifiedCount == 1);
    }
    
    // Removes tests that are over a week old
    public async testCleanup(): Promise<void> {

        const oldTests = await this.coll.find({ 
            docType: "TEST_RUN_FILE", 
            startTime: { $lt: new Date(Date.now() - 7 * FULL_DAY) } 
        }).toArray() as WithId<TestRunFileSchema>[];

        // Delete tests from S3 bucket


        // Delete tests from database
        const deleteResult = await this.coll.deleteMany(
            { _id: { $in: oldTests.map(test => test._id) } }
        );
    }
    
    // Refresh the number of manual runs
    public async refreshManualRuns(): Promise<void> {
        await this.coll.updateOne(
            { docType: "DASHBOARD" }, 
            { $set: { 
                "manualRun.remaining": MAX_DAILY_MANUAL_TESTS, 
                "manualRun.nextRefresh": new Date(Date.now() + FULL_DAY) 
            } }
        );
    }
}