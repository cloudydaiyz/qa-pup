import { ObjectId } from "mongodb";

export type RunType = "MANUAL" | "SCHEDULED";
export type RunStatus = "PASSED" | "FAILED" | "ERROR";
export type RunStatusLower = "passed" | "failed" | "error";
export type RunState = "RUNNING" | "AT REST";

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

// Information about a test file in the latest test run displayed on the dashboard
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
	name: string, // key name of the test file
	duration: number, // computed, based on latest end time of all tests
    status: RunStatus // computed, based on status of all tests 

	// Test information
	runId: ObjectId,
	// description: string, // description for test file
	startTime: Date, // computed, earliest start time of all tests
	testsRan: number, // computed
	testsPassed: number, // computed

	// Subset pattern; store only 10 tests max and implement pagination to
	// retrieve more (others will be in separate collection)
	tests: TestMetadataSchema[],
	
	sourceObjectUrl: string, // s3 object url to source code
	reporters: {
		htmlStaticUrl: string, // link from s3 static website to html reporter
		jsonObjectUrl: string // s3 object url to json reporter
	}
}

// === Test Metadata Document Schema ===
// Currently embedded in TestRunFileSchema, but could turn into a standalone
// document in the future as the # of tests increase

// Data from a single test in the file
export interface TestMetadataSchema {
	testRunFileId: ObjectId,
    suiteName?: string,
    testName: string,
    startTime: Date,
    duration: number,
    status: RunStatus,
	assets: TestAsset[] 
}

// Asset generated from test run
export interface TestAsset {
    name: string, // name of asset
    objectUrl: string // s3 object url for asset
}