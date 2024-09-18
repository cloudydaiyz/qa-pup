// Runs once when the function is deployed to setup the system

import { PupCore } from "@cloudydaiyz/qa-pup-core";

const pupCore = new PupCore();

export const handler = async () => {
    await pupCore.connection;

    // Initialize database index (helps with finding dashboard vs test files)
    await pupCore.testRunColl.createIndex({ docType: 1, runId: 1, name: 1 });

    return { statusCode: 200 };
}