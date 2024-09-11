// export assets to test-artifacts bucket

import assert from "assert";

const artifactsBucket = process.env.TEST_ARTIFACTS_BUCKET;

async function cleanup() {
    // assert(artifactsBucket, 'TEST_ARTIFACTS_BUCKET is required');
    console.log('cleaning');
}

cleanup();