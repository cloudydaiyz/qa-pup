import { DashboardSchema, RunType, TestMetadataSchema, TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";
import { Collection, MongoClient, ObjectId, UpdateFilter, UpdateResult } from "mongodb";
import { DB_NAME, FULL_DAY, FULL_HOUR, MAX_DAILY_MANUAL_TESTS, MONGODB_PASS, MONGODB_URI, MONGODB_USER, RAW_TEST_LIFETIME } from "./constants";
import { triggerEcsTestRun, sendTestCompletionEmails as sendTestCompletionEmails, sendVerificationEmail } from "./cloud";
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
        const dashboard = await this.testRunColl.findOne({ docType: "DASHBOARD" }) as DashboardSchema;
        assert(dashboard, "MongoDB improperly initialized");
        return dashboard;
    }
    
    // Obtains the info for a specific test run
    public async readLatestTestInfo(runId: ObjectId, name: string): Promise<TestRunFileSchema> {
        const testInfo = await this.testRunColl.findOne(
            { docType: "TEST_RUN_FILE", runId, name }
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
        const runId = new ObjectId();
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
        assert(updateDashboard.acknowledged && updateDashboard.matchedCount == 1 && updateDashboard.modifiedCount == 1, "Dashboard update failed");

        // Start the test runs in ECS cluster
        await triggerEcsTestRun(runId.toHexString());
    }

    // Adds an email to the list of emails to be notified for the current or next scheduled run
    // Returns true if the email was successfully added, false otherwise
    public async addToEmailList(email: string, current?: boolean): Promise<boolean> {
        let update: UpdateResult;
        if(current) {

            // Add the email to the list of emails to be notified for the current run 
            // if the max number of emails has not been reached and it's currently running
            update = await this.testRunColl.updateOne(
                { 
                    docType: "DASHBOARD", 
                    "currentRun.status": "RUNNING", 
                    "currentRun.emailList": { 
                        $size: { $lt: 10 },
                        $elemMatch: { $ne: email } 
                    } 
                }, 
                { $addToSet: { "currentRun.emailList": email } }
            );
        } else {

            // Add the email to the list of emails to be notified for the next scheduled run 
            // if the max number of emails has not been reached
            update = await this.testRunColl.updateOne(
                { 
                    docType: "DASHBOARD", 
                    "nextScheduledRun.emailList": { 
                        $size: { $lt: 10 }, 
                        $elemMatch: { $ne: email }  
                    } 
                }, 
                { $addToSet: { "nextScheduledRun.emailList": email } }
            );
        }
        assert(update.acknowledged);

        const addSuccess = update.modifiedCount == 1;
        if(addSuccess) await sendVerificationEmail(email);
        return addSuccess;
    }
}

// Additional functionality for other backend services
export class PupService extends PupCore {

    // Handles the completion of a test run
    public async testCompletion(): Promise<void> {
        const dashboard = await this.readDashboardInfo();

        // Obtain information from the dashboard
        const latestTestRuns = await this.testRunColl.find(
            { docType: "TEST_RUN_FILE", runId: dashboard.currentRun.runId },
            { 
                projection: { _id: 0, name: 1, duration: 1, status: 1 }
            }
        ).toArray() as TestRunFileSchema[];

        // Set the latest test run info in the dashboard
        const updateDashboard = await this.testRunColl.updateOne(
            { docType: "DASHBOARD" }, 
            {
                $set: {
                    runId: dashboard.currentRun.runId,
                    runType: dashboard.currentRun.runType,
                    startTime: dashboard.currentRun.startTime,
                    latestTests: latestTestRuns,
                    currentRun: {
                        state: "AT REST"
                    }
                }
            }, 
        );
        assert(updateDashboard.acknowledged && updateDashboard.matchedCount == 1 
            && updateDashboard.modifiedCount == 1);
        
        // Send test completion emails
        if(dashboard.currentRun.emailList!.length > 0) {
            await sendTestCompletionEmails(
                dashboard.currentRun.emailList!, 
                dashboard.nextScheduledRun.emailList,
                dashboard.currentRun.runId!.toHexString(), 
                latestTestRuns, 
            );
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

        operations.push(this.testRunColl.deleteMany(
            { _id: { $in: oldTestIds } }
        ));
        operations.push(this.testMetadataColl.deleteMany(
            { testRunFileId: { $in: oldTestIds } }
        ));

        // Wait for all the cleanup operations to finish
        await Promise.all(operations);
    }

    // Adds information from one file's test run into the database
    public async addTestRunFile(file: TestRunFileSchema, metadata: TestMetadataSchema[]): Promise<void> {
        // FUTURE: Limit the number of tests stored in the document
        // file.tests = file.tests.slice(0, 10); 
        
        const insertTest = await this.testRunColl.insertOne(file);
        assert(insertTest.acknowledged, "Test run file insertion failed");

        const insertMetadata = await this.testMetadataColl.insertMany(metadata);
        assert(insertMetadata.acknowledged, "Test metadata insertion failed");
    }
}