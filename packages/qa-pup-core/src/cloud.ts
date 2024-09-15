import { TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";
import { DeleteIdentityCommand, GetIdentityVerificationAttributesCommand, SendEmailCommand, SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import { ObjectId } from "mongodb";
import { composeEmailBody } from "./email";

// Sends AWS boilerplate email to verify an email address for sending
export async function sendVerificationEmail(email: string): Promise<void> {
    const client = new SESClient();
    const cmd = new VerifyEmailIdentityCommand({ EmailAddress: email });
    await client.send(cmd);
}

// Send test completion email via SES
export async function sendTestCompletionEmails(
    emailList: string[], nextRunEmailList: string[], 
    runId: ObjectId, latestTestRuns: TestRunFileSchema[]): Promise<void> { 
    const client = new SESClient();

    // Retrieve only the verified emails from the list
    const getVerifications = new GetIdentityVerificationAttributesCommand(
        { Identities: emailList }
    );
    const getVerificationsRes = await client.send(getVerifications);
    emailList = emailList.filter(email => 
        email in getVerificationsRes.VerificationAttributes!
        && getVerificationsRes.VerificationAttributes![email].VerificationStatus == "Success"
    );

    // Send the templated email
    const sendEmail = new SendEmailCommand({
        Source: "kyland03.biz@gmail.com",
        Destination: {
            ToAddresses: ["kyland03.biz@gmail.com"],
            BccAddresses: emailList,
        },
        Message: {
            Subject: {
                Data: "QA Pup - Your test run has completed (ID: " + runId.toHexString() + ")",
            },
            Body: {
                Html: {
                    Data: composeEmailBody(runId.toHexString(), latestTestRuns),
                }
            },
        },
    });
    await client.send(sendEmail);

    // Remove the emails from the list whether they've been verified or not if they're not
    // in the email list for the next scheduled run
    const emailsToRemove = emailList
        .filter(email => 
            !nextRunEmailList.includes(email) 
            && email in getVerificationsRes.VerificationAttributes!
        );
    for(const email of emailsToRemove) {
        const deleteEmail = new DeleteIdentityCommand({ Identity: email });
        await client.send(deleteEmail);
    }
}

// Initiates ECS task for the test run
export async function triggerEcsTestRun() { 
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ecs/command/RegisterTaskDefinitionCommand/
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/eventbridge/command/PutRuleCommand/
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ecs/command/StartTaskCommand/
        // override environment variables TEST_CODE_BUCKET, TEST_CODE_FILE, TEST_OUTPUT_BUCKET, and RUN_ID
}

// true if all tasks have completed, false otherwise
export async function isEcsTestRunComplete(): Promise<boolean> {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ecs/command/ListTasksCommand/
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ecs/command/DescribeTasksCommand/
    return true;
}

// Cleans up all cloud resources associated with a test run
export async function cleanupEcsTestRun() {
    // Deregister and delete ECS task definition associated with a test run
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ecs/command/DeregisterTaskDefinitionCommand/
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ecs/command/DeleteTaskDefinitionsCommand/

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/eventbridge/command/RemoveTargetsCommand/
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/eventbridge/command/DeleteRuleCommand/
}