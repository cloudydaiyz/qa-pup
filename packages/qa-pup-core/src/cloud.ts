import { DashboardSchema, TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";
import { DeleteIdentityCommand, GetIdentityVerificationAttributesCommand, SendEmailCommand, SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import { ObjectId } from "mongodb";
import { composeEmailBody } from "./email";

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

// TODO: Initiate Kubernetes test run
export async function triggerKubernetesTestRun() { }