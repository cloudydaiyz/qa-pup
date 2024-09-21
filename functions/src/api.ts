import { APIGatewayProxyHandler } from "aws-lambda";
import { PupCore } from "@cloudydaiyz/qa-pup-core";
import assert from "assert";

const pupCore = new PupCore();

// == Request Bodies ==

type AddEmailBody = {
    email: string;
    current: boolean;
}

type ManualRunBody = {
    email?: string;
}

// == Handler ==

export const handler: APIGatewayProxyHandler = async (event, context) => {
    await pupCore.connection;
    const path = event.requestContext.resourcePath;
    const method = event.requestContext.httpMethod;

    let body = JSON.stringify({ message: "Operation successful" });
    try {
        const dashboardPath = path == "/dashboard";
        const latestTestPath = path == "/latest-test/{runId}/{name}";
        const manualRunPath = path == "/manual-run";
        const addEmailPath = path == "/add-email";

        if(dashboardPath && method == "GET") {

            const dashboard = await pupCore.readDashboardInfo();
            body = JSON.stringify(dashboard);
        } else if(latestTestPath && method == "GET") {

            const testInfo = await pupCore.readLatestTestInfo(
                event.pathParameters!.runId as string, 
                event.pathParameters!.name as string
            );
            body = JSON.stringify(testInfo);
        } else if(manualRunPath && method == "POST") {

            let email = undefined;
            if(event.body) {
                const body = JSON.parse(event.body) as ManualRunBody;
                assert(typeof body.email == "string" || body.email == undefined,
                     "Invalid event body");
                email = body.email;
            } 
            await pupCore.triggerRun("MANUAL", email);
        } else if(addEmailPath && method == "POST") {
            assert(event.body, "Invalid event body");
            const body = JSON.parse(event.body) as AddEmailBody;

            assert(typeof body.email == "string" && typeof body.current == "boolean", 
                "Invalid event body");
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