import { TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";
import { DeleteIdentityCommand, GetIdentityVerificationAttributesCommand, SendEmailCommand, SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import { ObjectId } from "mongodb";
import { composeEmailBody } from "./email";
import { ECSClient, ListTasksCommand, DescribeTasksCommand, DesiredStatus, Task } from "@aws-sdk/client-ecs";
import { EventBridgeHandler } from "aws-lambda";
import assert from "assert";
import { ECS_CLUSTER_NAME } from "./constants";

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
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ecs/command/StartTaskCommand/
        // override environment variables TEST_CODE_BUCKET, TEST_CODE_FILE, TEST_OUTPUT_BUCKET, and RUN_ID
}

// True if all tasks have completed, false otherwise
export async function isEcsTestRunComplete(runId: string): Promise<boolean> {
    assert(ECS_CLUSTER_NAME, "ECS cluster name not set");
    const client = new ECSClient();
    const cluster = ECS_CLUSTER_NAME;
    
    let tasks = [] as string[];
    for (const desiredStatus of ["RUNNING", "PENDING", "STOPPED"] as DesiredStatus[]) {
        const listTasksCommand = new ListTasksCommand({ cluster, desiredStatus });
        const listTasksResult = await client.send(listTasksCommand);
        // console.log(JSON.stringify(listTasksResult, null, 2));

        tasks = tasks.concat(listTasksResult.taskArns!);
    }
    // console.log("Tasks:");
    // console.log(JSON.stringify(tasks, null, 2));
    
    const describeTasksCommand = new DescribeTasksCommand({ cluster, tasks });
    const taskInfo = await client.send(describeTasksCommand);
    // console.log(JSON.stringify(taskInfo, null, 2));
    
    // console.log("Task Info:");
    // console.log(JSON.stringify(taskInfo.tasks, null, 2));
    
    const filteredTasks = taskInfo.tasks!.filter(t => {
        return t.overrides!.containerOverrides!.find(o => {
            return o.environment!.find(e => e.name == "RUN_ID" && e.value == runId);
        });
    });
    assert(filteredTasks.length > 0, "No tasks found for run ID");

    // console.log("Filtered Task Info:");
    // console.log(JSON.stringify(filteredTasks, null, 2));
    
    filteredTasks.forEach((t, i) => {
        console.log(tasks[i], t.containers![0].lastStatus);
    });

    // Use lastStatus to determine if the task has completed for each container  
    return filteredTasks.every(t => t.containers![0].lastStatus == "STOPPED");
}