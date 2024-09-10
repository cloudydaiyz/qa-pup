import { ObjectId } from "mongodb";
type DocType = "DASHBOARD" | "TEST";
type RunType = "MANUAL" | "SCHEDULED";
type RunStatus = "PASS" | "FAIL" | "ERROR";
type RunState = "RUNNING" | "AT REST";
export interface DashboardSchema {
    _id: ObjectId;
    docType: DocType;
    runType: RunType;
    runId: ObjectId;
    startTime: Date;
    latestTests: LatestTestRun[];
    manualRun: {
        remaining: 3;
        max: 3;
        startTime: Date;
    };
    nextScheduledRun: {
        startTime: Date;
        emailList: string[];
    };
    currentRun: {
        status: RunState;
        runType: RunType;
        runId: ObjectId;
        startTime: Date;
        emailList: string[];
    };
}
export interface LatestTestRun {
    name: string;
    duration: number;
    status: RunStatus;
}
export interface TestRunSchema {
    docType: DocType;
    runId: ObjectId;
    startTime: Date;
    name: string;
    description: string;
    duration: number;
    testsRan: number;
    testsPassed: number;
    tests: [
        {
            suiteName: "sortHackerNewsArticles";
            testName: "sortHackerNewsArticles method 1";
            startTime: Date;
            duration: 100;
            status: RunStatus;
        }
    ];
    sourceCode: string;
    reporters: {
        htmlUri: string;
        jsonUri: string;
    };
    otherAssets: TestRunAsset[];
}
export interface TestRunAsset {
    name: string;
    downloadUri: string;
}
export {};
//# sourceMappingURL=types.d.ts.map