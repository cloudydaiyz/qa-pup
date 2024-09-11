import { S3Client, DeleteObjectsCommand, PutObjectCommand, ObjectIdentifier } from "@aws-sdk/client-s3"; // ES Modules import
import { TEST_ARTIFACTS_BUCKET } from "./constants";
import { TestRunFileSchema } from "@cloudydaiyz/qa-pup-types";

export async function deleteTestArtifacts(testRuns: TestRunFileSchema[]) {
    const reporterObjectKeys = testRuns
        .reduce(
            (keys, element) => 
                keys.concat(
                    { Key: element.reporters.htmlObjectKey }, 
                    { Key: element.reporters.jsonObjectKey }
                ), 
            [] as ObjectIdentifier[]
        );
    
    const otherAssetObjectKeys = testRuns
        .reduce(
            (keys, element) => 
                keys.concat(element.otherAssets.map(asset => { return { Key: asset.objectKey } })), 
            [] as ObjectIdentifier[]
        );

    const objects = reporterObjectKeys.concat(otherAssetObjectKeys);

    const s3Client = new S3Client();
    const command = new DeleteObjectsCommand({
        Bucket: TEST_ARTIFACTS_BUCKET,
        Delete: { Objects: objects }
    });
    await s3Client.send(command);
}

export async function uploadTestArtifacts(suiteName: string, testName: string) {
    const s3Client = new S3Client();
    const command = new PutObjectCommand({
        Bucket: TEST_ARTIFACTS_BUCKET,
        Key: "",
    });
}

// TODO
function initiateKubernetesTestRun() { }

// TODO
function sendTestCompletionEmail(emailList: string[]) { }

// 
// https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html#API_GetObject_RequestSyntax