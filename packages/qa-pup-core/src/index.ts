import { DashboardSchema, RunState, TestRunFileSchema, TestRunSchema } from "@cloudydaiyz/qa-pup-types";
import assert from "assert";
import { Collection, MongoClient, ObjectId, UpdateResult, WithId } from "mongodb";
import { COLL_NAME, DB_NAME, FULL_DAY, MAX_DAILY_MANUAL_TESTS } from "./constants";

class QAPupCore {
    client: MongoClient;
    coll: Collection<TestRunSchema | DashboardSchema | TestRunFileSchema>;
    
    constructor(uri: string) {
        this.client = new MongoClient(uri);
        this.coll = this.client.db(DB_NAME).collection(COLL_NAME);
    }

    async connect() {
        await this.client.connect();
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
                    state: "PASS" as RunState,
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
    
    public async triggerManualRun(email?: string) {
        await this.coll.updateOne({ docType: "DASHBOARD" }, {
            $set: {
                currentRun: {
                    state: "RUNNING",
                    runType: "MANUAL",
                    runId: new ObjectId(),
                    startTime: new Date(),
                    emailList: email ? [ email ] : []
                }
            }
        });

        // start the runs in the kubernetes cluster
        
    }
    
    public async addToEmailList(email: string, current?: boolean) {
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
    }
    
    // Removes tests that are over a week old
    public async testCleanup() {

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
    public async refreshManualRuns() {
        await this.coll.updateOne(
            { docType: "DASHBOARD" }, 
            { $set: { 
                "manualRun.remaining": MAX_DAILY_MANUAL_TESTS, 
                "manualRun.nextRefresh": new Date(Date.now() + FULL_DAY) 
            } }
        );
    }
}