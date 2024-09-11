import { APIGatewayProxyHandler } from "aws-lambda";
import { PupCore } from "@cloudydaiyz/qa-pup-core";
import { Path } from "path-parser";
import assert from "assert";
import { ObjectId } from "mongodb";

assert(process.env.MONGO_URI && process.env.MONGO_USER && process.env.MONGO_PASS, 
    "MongoDB environment variables not set");
const pupCore = new PupCore(process.env.MONGO_URI, process.env.MONGO_USER, process.env.MONGO_PASS);

const dashboardPath = new Path("/:stage/dashboard");
const latestTestPath = new Path("/:stage/latest-test/:runId/:name");
const manualRunPath = new Path("/:stage/manual-run");

export const handler: APIGatewayProxyHandler = async (event, context) => {
    await pupCore.connection;
    const path = event.requestContext.path;
    const method = event.requestContext.httpMethod;

    let body = JSON.stringify({ message: "Operation successful" });
    try {
        const parsedDashboardPath = dashboardPath.test(path);
        const parsedLatestTestPath = latestTestPath.test(path);
        const parsedManualRunPath = manualRunPath.test(path);

        if(parsedDashboardPath && method == "GET") {

            const dashboard = await pupCore.readDashboardInfo();
            body = JSON.stringify(dashboard);
        } else if(parsedLatestTestPath && method == "GET") {

            const testInfo = await pupCore.readLatestTestInfo(
                new ObjectId(parsedLatestTestPath.runId as string), 
                parsedLatestTestPath.name
            );
            body = JSON.stringify(testInfo);
        } else if(parsedManualRunPath && method == "POST") {

            assert(event.body, "No email provided in the request body");
            const email = JSON.parse(event.body).email;
            await pupCore.triggerRun("MANUAL", email);
        } else {

            body = JSON.stringify({ message: "Resource not found" });
            return { statusCode: 404, body };
        }
    } catch(e) {
        
        body = JSON.stringify({ message: (e as Error).message })
        return { statusCode: 400, body };
    }

    return { statusCode: 200, body };
}