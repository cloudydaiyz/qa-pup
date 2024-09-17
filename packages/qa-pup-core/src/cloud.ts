import { DeleteIdentityCommand, GetIdentityVerificationAttributesCommand, SendEmailCommand, SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import { ECSClient, ListTasksCommand, DescribeTasksCommand, DesiredStatus, Task, StartTaskCommand, RunTaskCommand } from "@aws-sdk/client-ecs";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";

import { ECS_CLUSTER_NAME, ECS_TASK_DEFINITION_NAME, TEST_INPUT_BUCKET } from "./constants";
import { composeEmailBody } from "./email";
import assert from "assert";


// Sends AWS boilerplate email to verify an email address for sending
export async function sendVerificationEmail(email: string): Promise<void> {
    const client = new SESClient();
    const cmd = new VerifyEmailIdentityCommand({ EmailAddress: email });
    await client.send(cmd);
}

// Send test completion email via SES
export async function sendTestCompletionEmails(
    emailList: string[], nextRunEmailList: string[], 
    runId: string, latestTestRuns: TestRunFileSchema[]): Promise<void> { 
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
                Data: "QA Pup - Your test run has completed (ID: " + runId + ")",
            },
            Body: {
                Html: {
                    Data: composeEmailBody(runId, latestTestRuns),
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
export async function triggerEcsTestRun(runId: string) { 
    assert(TEST_INPUT_BUCKET, "TEST_INPUT_BUCKET not set");

    // Get all the files from the input bucket
    const s3Client = new S3Client();
    const listObjectsCmd = new ListObjectsV2Command({
        Bucket: TEST_INPUT_BUCKET
    });
    const files = (await s3Client.send(listObjectsCmd)).Contents!.map(obj => obj.Key!);

    // Run a task for each file using the predefined task definition
    const taskOperations = []
    for(const file in files) {
        const ecsClient = new ECSClient();
        const startTaskCmd = new RunTaskCommand({
            cluster: ECS_CLUSTER_NAME,
            taskDefinition: ECS_TASK_DEFINITION_NAME,
            overrides: {
                containerOverrides: [
                    {
                        environment: [
                            { name: "RUN_ID", value: runId },
                            { name: "TEST_FILE", value: file },
                        ]
                    }
                ]
            }
        });
        taskOperations.push(ecsClient.send(startTaskCmd));
    }
    await Promise.all(taskOperations);
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