export type RunType = "MANUAL" | "SCHEDULED";
export type RunStatus = "PASSED" | "FAILED" | "ERROR";
export type RunStatusLower = "passed" | "failed" | "error";
export type RunState = "RUNNING" | "AT REST";

// === Dashboard Document Schema ===

// NOTE: The dashboard document has an _id of 1
export interface DashboardSchema {
	docType: "DASHBOARD",

	// Overall information for the latest test run
	runId: string, // stringified ObjectId
	runType: RunType,
	startTime: Date,

	// Information about each file in the latest test run
	// NOTE: May need to turn into subset if # of test files increase enough in future
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
		emailList: string[],
	},

    // Information about the current run
	currentRun: {
		state: RunState,
		emailList: string[],
		runType?: RunType,
		runId?: string, // stringified ObjectId
		startTime?: Date, 
	}
}

// Information about a test file in the latest test run displayed on the dashboard
export interface LatestTestRunFile {
    name: string,
    duration: number,
    status: RunStatus,
}

// === Test Run File Document Schema ===

// Test Run for tests defined in one file
export interface TestRunFileSchema {
	docType: "TEST_RUN_FILE",
	
	// Coincides with information from LatestTestRunFile
	name: string, // key name of the test file
	duration: number, // computed, based on latest end time of all tests
    status: RunStatus, // computed, based on status of all tests 

	// Test information
	runId: string, // stringified ObjectId
	startTime: Date, // computed, earliest start time of all tests
	testsRan: number, // computed
	testsPassed: number, // computed

	// Additional information about each test in the file
	// NOTE: May need to turn into subset if # of test files increase enough in future
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
	testRunFileId?: string, // stringified ObjectId
    suiteName?: string,
    testName: string,
    startTime: Date,
    duration: number,
    status: RunStatus,
	assets: TestAsset[], 
}

// Asset generated from test run
export interface TestAsset {
    name: string, // name of asset
    objectUrl: string, // s3 object url for asset
}

// == Public API Types ==

export interface Dashboard {
	runId: string,
	runType: RunType,
	startTime: string,

	latestTests: LatestTestRunFile[], 

	manualRun: {
		remaining: number,
		max: number,
		nextRefresh: string,
	},

	nextScheduledRun: {
		startTime: string,
	},

	currentRun: {
		state: RunState,
		runType?: RunType,
		runId?: string,
		startTime?: string, 
	}
}

export interface TestRunFile {
	id: string,
	name: string,
	duration: number,
	status: RunStatus,

	runId: string,
	startTime: string,
	testsRan: number,
	testsPassed: number,

	tests: TestMetadata[],
	
	sourceObjectUrl: string,
	reporters: {
		htmlStaticUrl: string,
		jsonObjectUrl: string
	}
}

export interface TestMetadata {
	testRunFileId?: string,
    suiteName?: string,
    testName: string,
    startTime: string,
    duration: number,
    status: RunStatus,
	assets: TestAsset[], 
}

export interface PaginatedTestMetadata {
	metadata: TestMetadata[],
	offset: number,
	n: number,
	total: number,
}