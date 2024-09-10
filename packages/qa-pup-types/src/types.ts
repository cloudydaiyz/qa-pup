import { ObjectId } from "mongodb";

type RunType = "MANUAL" | "SCHEDULED";
type RunStatus = "PASS" | "FAIL" | "ERROR";
type RunState = "RUNNING" | "AT REST";

export interface TestSchema {
    docType: "TEST",
    runId: ObjectId,
    runType: RunType,
    startTime: Date, 
    emailList: string[]
}

// === Dashboard Document Schema ===

// NOTE: The dashboard document has an _id of 1
export interface DashboardSchema {
	docType: "DASHBOARD",
	runType: RunType,
	runId: ObjectId,
	startTime: Date,
	latestTests: LatestTestRun[],

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
		status: RunState,
		runType: RunType,
		runId: ObjectId,
		startTime: Date, 
		emailList: string[]
	}
}

export interface LatestTestRun {
    name: string,
    duration: number,
    status: RunStatus
}

// === Test Run Document Schema ===

export interface TestRunSchema {
	docType: "TEST_RUN",
	runId: ObjectId,
	startTime: Date,
	name: string,
	description: string,
	duration: number,
	testsRan: number,
	testsPassed: number,
	tests: TestMetadata[],
	sourceCode: string,
	reporters: {
		htmlUri: string, // link to html reporter
		jsonUri: string // link to json reporter
	},
	otherAssets: TestRunAsset[]
}

// Singular test
export interface TestMetadata {
    suiteName: string,
    testName: string,
    startTime: Date,
    duration: number,
    status: RunStatus
}

// Asset generated from test run
export interface TestRunAsset {
    name: string,
    downloadUri: string
}