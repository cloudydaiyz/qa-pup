import { DashboardSchema, RunState, RunType, TestMetadataSchema, TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";
import { Collection, MongoClient, ObjectId, UpdateFilter, UpdateResult, WithId } from "mongodb";
import { DB_NAME, FULL_DAY, MAX_DAILY_MANUAL_TESTS, TEST_LIFETIME } from "./constants";
import { initiateKubernetesTestRun } from "./cloud";
import assert from "assert";
import { read } from "fs";

type TestRunCollection = DashboardSchema | TestRunFileSchema;
type TestMetadataCollection = TestMetadataSchema;

// Implementation for client-facing controller methods
export class PupCore {
    client: MongoClient;
    testRunColl: Collection<TestRunCollection>;
    testMetadataColl: Collection<TestMetadataCollection>;
    connection: Promise<MongoClient>;
    
    constructor(uri: string, user: string, pass: string) {
        this.client = new MongoClient(uri, { auth: { username: user, password: pass } });
        this.testRunColl = this.client.db(DB_NAME).collection("testRun");
        this.testMetadataColl = this.client.db(DB_NAME).collection("testMetadata");
        this.connection = this.client.connect();
    }

    public async readDashboardInfo(): Promise<DashboardSchema> {
        const dashboard = await this.testRunColl.findOne({ docType: "DASHBOARD" }) as DashboardSchema;
        assert(dashboard, "MongoDB improperly initialized");
        return dashboard;
    }
    
    public async readLatestTestInfo(runId: ObjectId, name: string): Promise<TestRunFileSchema> {
        const testInfo = await this.testRunColl.findOne(
            { docType: "TEST_RUN_FILE", runId, name }
        ) as TestRunFileSchema;
        assert(testInfo, "No test info currently available for the specified test run");
        return testInfo;
    }
    
    public async triggerRun(runType: RunType, email?: string): Promise<boolean> {
        let userInEmailList = true;

        // Init the filter to update the test run collection
        let emailList = email ? [ email ] : [];
        let updateFilter: UpdateFilter<TestRunCollection> = {
            $set: {
                currentRun: {
                    state: "RUNNING",
                    runType: runType,
                    runId: new ObjectId(),
                    startTime: new Date(),
                    emailList: emailList
                }
            }
        };

        // Update the filter based on the run type
        const dashboard = await this.readDashboardInfo();
        if(runType == "SCHEDULED") {
            
            // Update the stats of the next scheduled run
            const scheduleList = dashboard.nextScheduledRun.emailList.slice(0, 10);
            userInEmailList = scheduleList.length < 10;
            emailList = userInEmailList ? scheduleList.concat(emailList) : scheduleList;

            updateFilter.$set = {
                ...updateFilter.$set, 
                    nextScheduledRun: {
                    startTime: new Date(Date.now() + FULL_DAY),
                    emailList: emailList
                }
            };
        } else {
            assert(dashboard.manualRun.remaining > 0, "No manual runs remaining for today");

            // Decrement the remaining amount of manual runs
            updateFilter.$inc = { "manualRun.remaining": -1 }
        }

        // Update the test run collection with the new run info
        await this.testRunColl.updateOne({ docType: "DASHBOARD" }, updateFilter);

        // Start the test runs in the kubernetes cluster
        await initiateKubernetesTestRun();

        // Return whether the user was in the email list or not
        return userInEmailList;
    }

    public async addToEmailList(email: string, current?: boolean): Promise<void> {
        let update: UpdateResult;
        if(current) {

            // Add the email to the list of emails to be notified for the current run 
            // if the max number of emails has not been reached and it's currently running
            update = await this.testRunColl.updateOne(
                { 
                    docType: "DASHBOARD", 
                    "currentRun.status": "RUNNING", 
                    "currentRun.emailList": { $size: { $lt: 10 } } 
                }, 
                { $addToSet: { emailList: email } }
            );
        } else {

            // Add the email to the list of emails to be notified for the next scheduled run 
            // if the max number of emails has not been reached
            update = await this.testRunColl.updateOne(
                { docType: "DASHBOARD", "nextScheduledRun.emailList": { $size: { $lt: 10 } } }, 
                { $addToSet: { "nextScheduledRun.emailList": email } }
            );
        }
        assert(update.acknowledged && update.matchedCount == 1 && update.modifiedCount == 1);
    }
}

// Additional functionality for other backend services
export class PupService extends PupCore {

    // Handles the completion of a test run
    public async testCompletion(): Promise<void> {
        const dashboard = await this.readDashboardInfo();

        const latestTestRuns = await this.testRunColl.find(
            { docType: "TEST_RUN_FILE", runId: dashboard.currentRun.runId },
            { 
                projection: { _id: 0, name: 1, duration: 1, status: 1 }
            }
        ).toArray() as TestRunFileSchema[];

        // Set the latest test run info in the dashboard
        const updateDashboard = await this.testRunColl.updateOne({ docType: "DASHBOARD" }, {
            $set: {
                runId: dashboard.currentRun.runId,
                runType: dashboard.currentRun.runType,
                startTime: dashboard.currentRun.startTime,
                latestTests: latestTestRuns,
                currentRun: {
                    state: "AT REST"
                }
            }
        });
        assert(updateDashboard.acknowledged && updateDashboard.matchedCount == 1 
            && updateDashboard.modifiedCount == 1);

        // Send test completion emails
    }
    
    // Handles the cleanup of old tests and manual run refreshes
    public async testLifecycleCleanup(): Promise<void> {
        const operations = [];

        // Refresh the number of manual runs
        operations.push(this.testRunColl.updateOne(
            { docType: "DASHBOARD" }, 
            { $set: { 
                "manualRun.remaining": MAX_DAILY_MANUAL_TESTS, 
                "manualRun.nextRefresh": new Date(Date.now() + FULL_DAY) 
            } }
        ));

        // Removes tests that are over a week old from the database
        const oldTests = await this.testRunColl.find({ 
            docType: "TEST_RUN_FILE", 
            startTime: { $lt: new Date(Date.now() - TEST_LIFETIME) } 
        }).toArray() as WithId<TestRunFileSchema>[];

        // Delete test from database & old test artifacts from S3 bucket
        operations.push(this.testRunColl.deleteMany(
            { _id: { $in: oldTests.map(test => test._id) } }
        ));

        // Wait for all the cleanup operations to finish
        await Promise.all(operations);
    }

    // Adds information from one file's test run into the database
    public async addTestRunFile(file: TestRunFileSchema, metadata: TestMetadataSchema[]): Promise<void> {
        const insertTest = await this.testRunColl.insertOne(file);
        assert(insertTest.acknowledged, "Test run file insertion failed");

        const insertMetadata = await this.testMetadataColl.insertMany(metadata);
        assert(insertMetadata.acknowledged, "Test metadata insertion failed");
    }
}