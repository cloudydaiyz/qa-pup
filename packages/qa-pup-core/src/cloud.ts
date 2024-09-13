import { TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";
import { SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";


// TODO: Initiate Kubernetes test run
export async function triggerKubernetesTestRun() { }

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/VerifyEmailIdentityCommand/
export async function sendVerificationEmail(email: string): Promise<void> {
    const client = new SESClient();
    const cmd = new VerifyEmailIdentityCommand({ EmailAddress: email });
    await client.send(cmd);
}

// TODO: Send test completion email via SES
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/GetIdentityVerificationAttributesCommand/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/SendTemplatedEmailCommand/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/DeleteIdentityCommand/
export async function sendTestCompletionEmails(emailList: string[]) { 
    
}