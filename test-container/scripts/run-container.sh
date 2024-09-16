#!/bin/sh

DIR=`dirname $0`
docker build -t test-container -f "${DIR}/../Dockerfile" "${DIR}/.."

if [ -f "${DIR}/secrets.sh" ]; then
    echo Obtaining environment variables from "${DIR}/secrets.sh..."

    # Use `source` command since we want the variables defined in the current
    # shell environment, not a child process
    source "${DIR}/secrets.sh"

    # Generate the Run ID using a valid ObjectID string
    export RUN_ID=`node "${DIR}/generate-run.js"`
fi

# docker run \
#     -e TEST_INPUT_BUCKET="$TEST_INPUT_BUCKET" \
#     -e TEST_FILE="$TEST_FILE" \
#     -e TEST_OUTPUT_BUCKET="$TEST_OUTPUT_BUCKET" \
#     -e AWS_REGION="$AWS_REGION" \
#     -e AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
#     -e AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
#     -e MONGODB_URI="$MONGODB_URI" \
#     -e MONGODB_USER="$MONGODB_USER" \
#     -e MONGODB_PASS="$MONGODB_PASS" \
#     -e RUN_ID="$RUN_ID" \
#     test-container