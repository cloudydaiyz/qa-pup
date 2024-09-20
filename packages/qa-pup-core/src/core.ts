import { DashboardSchema, LatestTestRunFile, RunType, TestMetadataSchema, TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";
import { Collection, MongoClient, ObjectId, UpdateFilter, UpdateResult } from "mongodb";
import { DB_NAME, FULL_DAY, FULL_HOUR, MAX_DAILY_MANUAL_TESTS, MONGODB_PASS, MONGODB_URI, MONGODB_USER, RAW_TEST_LIFETIME } from "./constants";
import assert from "assert";

type TestRunCollection = DashboardSchema | TestRunFileSchema;
type TestMetadataCollection = TestMetadataSchema;

// Implementation for client-facing controller methods
export class PupCore {
    client: MongoClient;
    testRunColl: Collection<TestRunCollection>;
    testMetadataColl: Collection<TestMetadataCollection>;
    connection: Promise<MongoClient>;
    
    constructor() {
        this.client = new MongoClient(MONGODB_URI, { auth: { username: MONGODB_USER, password: MONGODB_PASS } });
        this.testRunColl = this.client.db(DB_NAME).collection("testRun");
        this.testMetadataColl = this.client.db(DB_NAME).collection("testMetadata");
        this.connection = this.client.connect();
    }

    // Obtains the current dashboard info
    public async readDashboardInfo(): Promise<DashboardSchema> {
        const dashboard = await this.testRunColl.findOne(
            { docType: "DASHBOARD" },
            { projection: { _id: 0 } }
        ) as DashboardSchema;
        assert(dashboard, "MongoDB improperly initialized");
        return dashboard;
    }
    
    // Obtains the info for a specific test run
    public async readLatestTestInfo(runId: string, name: string): Promise<TestRunFileSchema> {
        const testInfo = await this.testRunColl.findOne(
            { docType: "TEST_RUN_FILE", runId, name },
            { projection: { _id: 0 } }
        ) as TestRunFileSchema;
        assert(testInfo, "No test info currently available for the specified test run");
        return testInfo;
    }
    
    // Triggers a scheduled or manual test run with the optionally specified email on the email list
    // NOTE: Scheduled runs can't have with the email parameter
    public async triggerRun(runType: RunType, email?: string): Promise<void> {
        assert(runType == "MANUAL" || !email, "Scheduled runs cannot have an email parameter");

        // Obtain and validate parameters against the dashboard
        const dashboard = await this.readDashboardInfo();
        assert(dashboard.currentRun.state == "AT REST", "A test run is already in progress");
        assert(
            runType == "SCHEDULED" 
            || Date.now() + FULL_HOUR < dashboard.nextScheduledRun.startTime.getTime(), 
            "Cannot trigger a test run within an hour of a scheduled run."
        );

        // Initalize the filter to update the test run collection
        const runId = new ObjectId().toHexString();
        let emailList = email ? [ email ] : [];
        let updateFilter: UpdateFilter<TestRunCollection> = {
            $set: {
                currentRun: {
                    state: "RUNNING",
                    runType,
                    runId,
                    startTime: new Date(),
                    emailList
                }
            }
        };

        // Update the filter based on the run type
        if(runType == "SCHEDULED") {
            assert(Date.now() > dashboard.nextScheduledRun.startTime.getTime(), 
                "Scheduled run not ready to be triggered");

            // Update the stats of the next scheduled run
            const scheduleList = dashboard.nextScheduledRun.emailList;
            updateFilter.$set = {
                ...updateFilter.$set, 
                nextScheduledRun: {
                    startTime: new Date(Date.now() + FULL_DAY),
                    emailList: []
                }
            };
            updateFilter.$set.currentRun.emailList = scheduleList;
        } else {
            assert(dashboard.manualRun.remaining > 0, "No manual runs remaining for today");

            // Decrement the remaining amount of manual runs
            updateFilter.$inc = { "manualRun.remaining": -1 };
        }

        // Update the test run collection with the new run info
        const updateDashboard = await this.testRunColl.updateOne({ docType: "DASHBOARD" }, updateFilter);
        assert(updateDashboard.acknowledged && updateDashboard.modifiedCount == 1, 
            "Dashboard update failed");

        // Start the test runs in ECS cluster
        await import("./cloud").then(cloud => cloud.triggerEcsTestRun(runId));
    }

    // Adds an email to the list of emails to be notified for the current or next scheduled run
    // Returns true if the email was successfully added, false otherwise
    public async addToEmailList(email: string, current?: boolean): Promise<void> {
        let update: UpdateResult;
        if(current) {

            // Add the email to the list of emails to be notified for the current run 
            // if the max number of emails has not been reached and it's currently running
            update = await this.testRunColl.updateOne(
                { 
                    docType: "DASHBOARD", 
                    "currentRun.status": "RUNNING", 
                    $expr: { $lt: [ { $size: "$currentRun.emailList" }, 10 ] },
                    "currentRun.emailList": { $ne: email } 
                }, 
                { $push: { "currentRun.emailList": email } }
            );
        } else {

            // Add the email to the list of emails to be notified for the next scheduled run 
            // if the max number of emails has not been reached
            update = await this.testRunColl.updateOne(
                { 
                    docType: "DASHBOARD", 
                    $expr: { $lt: [ { $size: "$nextScheduledRun.emailList" }, 10 ] },
                    "nextScheduledRun.emailList": { $ne: email } 
                }, 
                { $push: { "nextScheduledRun.emailList": email } }
            );
        }
        assert(update.acknowledged && update.modifiedCount == 1, "Unable to add email to the email list");

        // Sends AWS verification email
        await import("./cloud").then(cloud => cloud.sendVerificationEmail(email));
    }
}

// Additional functionality for other backend services
export class PupService extends PupCore {

    // Handles the completion of a test run with the specified run ID
    public async testCompletion(runId: string): Promise<void> {
        const dashboard = await this.readDashboardInfo();
        assert(dashboard.currentRun.state == "RUNNING", "No test run currently in progress");
        assert(dashboard.currentRun.runId == runId, "Invalid run ID");

        // Obtain information from the dashboard
        const latestTestRunFiles = await this.testRunColl.find(
            { docType: "TEST_RUN_FILE", runId },
            { 
                projection: { _id: 0, name: 1, duration: 1, status: 1 }
            }
        ).toArray() as LatestTestRunFile[];

        // Set the latest test run info in the dashboard
        const updateDashboard = await this.testRunColl.updateOne(
            { docType: "DASHBOARD" }, 
            {
                $set: {
                    runId,
                    runType: dashboard.currentRun.runType,
                    startTime: dashboard.currentRun.startTime,
                    latestTests: latestTestRunFiles,
                    currentRun: {
                        state: "AT REST",
                        emailList: []
                    }
                }
            }, 
        );
        assert(updateDashboard.acknowledged && updateDashboard.matchedCount == 1 
            && updateDashboard.modifiedCount == 1, "Unable to update dashboard");
        
        // Send test completion emails
        if(dashboard.currentRun.emailList!.length > 0) {
            await import("./cloud").then(cloud => cloud.sendTestCompletionEmails(
                dashboard.currentRun.emailList!, 
                dashboard.nextScheduledRun.emailList,
                runId, 
                latestTestRunFiles, 
            ));
        }
    }
    
    // Handles the cleanup of old tests and manual run refreshes
    public async testLifecycleCleanup(): Promise<void> {
        assert(RAW_TEST_LIFETIME, "Invalid environment variable RAW_TEST_LIFETIME");
        const TEST_LIFETIME = Number(RAW_TEST_LIFETIME);
        const operations = [];

        // Refresh the number of manual runs
        operations.push(this.testRunColl.updateOne(
            { docType: "DASHBOARD" }, 
            { $set: { 
                "manualRun.remaining": MAX_DAILY_MANUAL_TESTS, 
                "manualRun.nextRefresh": new Date(Date.now() + FULL_DAY) 
            } }
        ));

        // Remove old tests and their metadata from the database
        const oldTestIds = await this.testRunColl.find({ 
            docType: "TEST_RUN_FILE", 
            startTime: { $lt: new Date(Date.now() - TEST_LIFETIME) } 
        }).toArray().then(docs => docs.map(test => test._id));
        const oldTestStringIds = oldTestIds.map(id => id.toHexString());

        operations.push(this.testRunColl.deleteMany(
            { _id: { $in: oldTestIds } }
        ));
        operations.push(this.testMetadataColl.deleteMany(
            { testRunFileId: { $in: oldTestStringIds } }
        ));

        // Wait for all the cleanup operations to finish
        await Promise.all(operations);
    }

    // Adds information from one file's test run into the database
    public async addTestRunFile(file: TestRunFileSchema): Promise<void> {
        const tests = file.tests;

        // FUTURE: Limit the number of tests stored in the document
        // file.tests = file.tests.slice(0, 10); 
        
        // Insert the test run file and its metadata
        const insertTest = await this.testRunColl.insertOne(file);
        assert(insertTest.acknowledged, "Test run file insertion failed");

        let metadata = tests;
        metadata.forEach(test => test.testRunFileId = insertTest.insertedId.toHexString());

        const insertMetadata = await this.testMetadataColl.insertMany(metadata);
        assert(insertMetadata.acknowledged, "Test metadata insertion failed");
    }
}