import { ObjectId } from "mongodb";

export type RunType = "MANUAL" | "SCHEDULED";
export type RunStatus = "PASS" | "FAIL" | "ERROR";
export type RunState = "RUNNING" | "AT REST";

// === Test Run Schema ===

export interface TestRunSchema {
    docType: "TEST_RUN",

    runId: ObjectId,
    runType: RunType,
    startTime: Date, 
    emailList: string[]
}

// === Dashboard Document Schema ===

// NOTE: The dashboard document has an _id of 1
export interface DashboardSchema {
	docType: "DASHBOARD",

	// Information for the latest test run
	runId: ObjectId,
	runType: RunType,
	startTime: Date,
	latestTests: LatestTestRunFile[],

    // Information about initiating a manual run
	manualRun: {
		remaining: number,
		max: number,
		nextRefresh: Date,
	},

    // Information to be used for the next scheduled run
	nextScheduledRun: {
		startTime: Date,
		emailList: string[]
	},

    // Information about the current run
	currentRun: {
		state: RunState,
		runType?: RunType,
		runId?: ObjectId,
		startTime?: Date, 
		emailList?: string[]
	}
}

// Information about a test file in the latest test run displayed on the
// dashboard
export interface LatestTestRunFile {
    name: string,
    duration: number,
    status: RunStatus
}

// === Test Run File Document Schema ===

// Test Run for a tests defined in one file
export interface TestRunFileSchema {
	docType: "TEST_RUN_FILE",
	
	// Coincides with information from LatestTestRunFile
	name: string,
	duration: number,
    status: RunStatus

	runId: ObjectId,
	description: string,
	startTime: Date,
	testsRan: number,
	testsPassed: number,
	tests: TestMetadata[],
	
	sourceCode: string, // download link to source code
	reporters: {
		htmlUri: string, // link to html reporter
		htmlObjectKey: string, // s3 object key to html reporter
		jsonObjectKey: string // s3 object key to json reporter
	},
	otherAssets: TestRunAsset[] 
}

// Data from a single test in the file
export interface TestMetadata {
    suiteName: string,
    testName: string,
    startTime: Date,
    duration: number,
    status: RunStatus
}

// Asset generated from test run
export interface TestRunAsset {
    name: string, // name of asset
    objectKey: string // s3 object key for asset
}