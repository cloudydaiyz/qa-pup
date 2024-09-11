import { S3Client, DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
import { TEST_ARTIFACTS_BUCKET } from "./constants";

async function deleteTestArtifacts() {
    const s3Client = new S3Client();
    const command = new DeleteObjectsCommand({
        Bucket: TEST_ARTIFACTS_BUCKET,
        Delete: {
            Objects: [
                { Key: "test1" },
                { Key: "test2" }
            ]
        }
    });
    const res = await s3Client.send(command);
}

async function uploadTestArtifacts(suiteName: string, testName: string) {
    const s3Client = new S3Client();
    const command = new PutObjectCommand({
        Bucket: TEST_ARTIFACTS_BUCKET,
        Key: "",

    });
}

function sendTestCompletionEmail(emailList: string[]) {

}