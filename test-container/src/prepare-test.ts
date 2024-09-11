// import tests from S3 bucket into the ./tests folder

import assert from "assert";

const codeBucket = process.env.TEST_CODE_BUCKET;

async function prepare() {
    // assert(codeBucket, 'TEST_CODE_BUCKET is required');
    console.log('preparing');
}

prepare();