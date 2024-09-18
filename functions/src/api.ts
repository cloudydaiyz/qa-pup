import { APIGatewayProxyHandler } from "aws-lambda";
import { PupCore } from "@cloudydaiyz/qa-pup-core";
import { Path } from "path-parser";
import assert from "assert";
import { RunType } from "@cloudydaiyz/qa-pup-types";

const pupCore = new PupCore();

const dashboardPath = new Path("/:stage/dashboard");
const latestTestPath = new Path("/:stage/latest-test/:runId/:name");
const manualRunPath = new Path("/:stage/manual-run");
const addEmailPath = new Path("/:stage/add-email");

// == Request Bodies ==

type AddEmailBody = {
    email: string;
    current: boolean;
}

// == Handler ==

export const handler: APIGatewayProxyHandler = async (event, context) => {
    await pupCore.connection;
    const path = event.requestContext.path;
    const method = event.requestContext.httpMethod;

    let body = JSON.stringify({ message: "Operation successful" });
    try {
        const parsedDashboardPath = dashboardPath.test(path);
        const parsedLatestTestPath = latestTestPath.test(path);
        const parsedManualRunPath = manualRunPath.test(path);
        const parsedAddEmailPath = addEmailPath.test(path);

        if(parsedDashboardPath && method == "GET") {

            const dashboard = await pupCore.readDashboardInfo();
            body = JSON.stringify(dashboard);
        } else if(parsedLatestTestPath && method == "GET") {

            const testInfo = await pupCore.readLatestTestInfo(
                parsedLatestTestPath.runId as string, 
                parsedLatestTestPath.name
            );
            body = JSON.stringify(testInfo);
        } else if(parsedManualRunPath && method == "POST") {

            let email = undefined;
            if(event.body) email = JSON.parse(event.body).email;
            await pupCore.triggerRun("MANUAL", email);
        } else if(parsedAddEmailPath && method == "POST") {
            assert(event.body, "Invalid event body");
            const body = JSON.parse(event.body) as AddEmailBody;

            assert(body.email && body.current != undefined, "Invalid event body");
            await pupCore.addToEmailList(body.email, body.current);
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