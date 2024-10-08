import { APIGatewayProxyHandler } from "aws-lambda";
import { PupCore, PupError } from "@cloudydaiyz/qa-pup-core";
import { isEmailVerified, sendVerificationEmail } from "@cloudydaiyz/qa-pup-core/cloud";
import assert from "assert";
import { AddEmailBody, ManualRunBody, VerifyEmailBody } from "./types.js";

const pupCore = new PupCore();

// == Handler ==

export const handler: APIGatewayProxyHandler = async (event, context) => {
    await pupCore.connection;
    const path = event.requestContext.resourcePath;
    const method = event.requestContext.httpMethod;

    const headers = {
        "Access-Control-Allow-Origin": event.headers.origin == "http://localhost:5173" ?
            "http://localhost:5173" : "https://qa-pup.pages.dev",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    };
    let body = JSON.stringify({ message: "Operation successful" });

    if(method == "OPTIONS") return { statusCode: 200, body, headers };
    try {
        const dashboardPath = path == "/dashboard";
        const latestTestPath = path == "/run/{runId}/{name}";
        const testMetadataPath = path == "/run/{runFileId}/metadata";
        const manualRunPath = path == "/manual-run";
        const addEmailPath = path == "/add-email";
        const checkEmail = path == "/check-email";
        const verifyEmail = path == "/verify-email";

        if(dashboardPath && method == "GET") {

            const dashboard = await pupCore.readPublicDashboard();
            body = JSON.stringify(dashboard);
        } else if(latestTestPath && method == "GET") {

            const testInfo = await pupCore.readPublicTestInfo(
                event.pathParameters!.runId as string, 
                event.pathParameters!.name as string
            );
            body = JSON.stringify(testInfo);
        } else if(testMetadataPath && method == "GET") {
            const offset = Number(event.queryStringParameters?.offset);
            const n = Number(event.queryStringParameters?.n);

            const metadata = await pupCore.readPublicTestMetadata(
                event.pathParameters!.runFileId as string, 
                Number.isNaN(offset) ? 0 : offset,
                Number.isNaN(n) ? 10 : n,
            );
            body = JSON.stringify(metadata);
        } else if(manualRunPath && method == "POST") {

            let email = undefined;
            if(event.body) {
                const eventBody = JSON.parse(event.body) as ManualRunBody;
                assert(typeof eventBody.email == "string" || eventBody.email == undefined,
                     "Invalid event body");
                email = eventBody.email;
            } 
            await pupCore.triggerRun("MANUAL", email);
        } else if(addEmailPath && method == "POST") {
            assert(event.body, "Invalid event body");
            const eventBody = JSON.parse(event.body) as AddEmailBody;

            assert(typeof eventBody.email == "string" && typeof eventBody.current == "boolean", 
                "Invalid event body");
            await pupCore.addToEmailList(eventBody.email, eventBody.current);
        } else if(checkEmail && method == "POST") {
            assert(event.body, "Invalid event body");
            const eventBody = JSON.parse(event.body) as VerifyEmailBody;
            assert(typeof eventBody.email == "string", "Invalid event body");

            body = JSON.stringify({ verified: await isEmailVerified(eventBody.email)});
        } else if(verifyEmail && method == "POST") {
            assert(event.body, "Invalid event body");
            const eventBody = JSON.parse(event.body) as VerifyEmailBody;
            assert(typeof eventBody.email == "string", "Invalid event body");

            await sendVerificationEmail(eventBody.email);
        } else {

            body = JSON.stringify({ message: "Resource not found" });
            return { statusCode: 404, headers, body };
        }
    } catch(e) {
        if(e instanceof PupError) {
            body = JSON.stringify({ message: e.message })
            return { statusCode: 400, headers, body };
        }
        
        body = "Encountered server error. Please try again later.";
        console.log(JSON.stringify({ message: (e as Error).message }));
        return { statusCode: 500, headers, body };
    }

    return { statusCode: 200, headers, body };
}