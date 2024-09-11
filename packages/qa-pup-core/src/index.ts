import { DashboardSchema, RunState, RunType, TestRunFileSchema, TestRunSchema } from "@cloudydaiyz/qa-pup-types";
import { Collection, MongoClient, ObjectId, UpdateResult, WithId } from "mongodb";
import { COLL_NAME, DB_NAME, FULL_DAY, MAX_DAILY_MANUAL_TESTS, TEST_LIFETIME } from "./constants";
import assert from "assert";

export class PupCore {
    client: MongoClient;
    coll: Collection<TestRunSchema | DashboardSchema | TestRunFileSchema>;
    connection: Promise<MongoClient>;
    
    constructor(uri: string, user: string, pass: string) {
        this.client = new MongoClient(uri, { auth: { username: user, password: pass } });
        this.coll = this.client.db(DB_NAME).collection(COLL_NAME);
        this.connection = this.client.connect();
    }

    public async readDashboardInfo(): Promise<DashboardSchema> {
        let dashboard = await this.coll.findOne({ docType: "DASHBOARD" }) as DashboardSchema;
        assert(dashboard, "MongoDB improperly initialized");
        return dashboard;
    }
    
    public async readLatestTestInfo(runId: ObjectId, name: string): Promise<TestRunFileSchema> {
        const testInfo = await this.coll.findOne(
            { docType: "TEST_RUN_FILE", runId, name }
        ) as TestRunFileSchema;
        assert(testInfo);
        return testInfo;
    }
    
    public async triggerRun(runType: RunType, email?: string): Promise<boolean> {

        let emailList = email ? [ email ] : [];
        let userInEmailList = true;
        if(runType == "SCHEDULED") {
            const dashboard = await this.coll.findOne({ docType: "DASHBOARD" }) as DashboardSchema;
            assert(dashboard);
            const scheduleList = dashboard.nextScheduledRun.emailList;

            emailList = scheduleList.length < 10 
                ? emailList.concat(dashboard.nextScheduledRun.emailList) 
                : scheduleList;
            userInEmailList = scheduleList.length < 10;
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


        return userInEmailList;
    }

    public async addToEmailList(email: string, current?: boolean): Promise<void> {
        let update: UpdateResult;
        if(current) {

            // Add the email to the list of emails to be notified for the current run 
            // if the max number of emails has not been reached and it's currently running
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
            startTime: { $lt: new Date(Date.now() - TEST_LIFETIME) } 
        }).toArray() as WithId<TestRunFileSchema>[];

        // Delete old test artifacts from S3 bucket
        

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