import { TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";


// TODO: Initiate Kubernetes test run
export async function triggerKubernetesTestRun() { }


// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/SendCustomVerificationEmailCommand/
export async function sendVerificationEmail(email: string) {

}

// TODO: Send test completion email via SES
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/GetIdentityVerificationAttributesCommand/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/SendTemplatedEmailCommand/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/DeleteIdentityCommand/
export async function sendTestCompletionEmails(emailList: string[]) { 

}