export const MAX_DAILY_MANUAL_TESTS = 3;
export const DB_NAME = "testData";
export const COLL_NAME = "data";

export const FULL_DAY = 24 * 60 * 60 * 1000;
export const TEST_LIFETIME = 7 * FULL_DAY;

export const TEST_ARTIFACTS_BUCKET = "qa-pup-test-artifacts";
export const TEST_CODE_BUCKET = "qa-pup-test-code";

// dashboard = {
//     docType: "DASHBOARD",
//     runId: new ObjectId(),
//     runType: "SCHEDULED",
//     startTime: new Date(),
//     latestTests: [],
//     manualRun: {
//         remaining: MAX_DAILY_MANUAL_TESTS,
//         max: MAX_DAILY_MANUAL_TESTS,
//         nextRefresh: new Date()
//     },
//     nextScheduledRun: {
//         startTime: new Date(),
//         emailList: []
//     },
//     currentRun: {
//         state: "AT REST",
//     }
// };