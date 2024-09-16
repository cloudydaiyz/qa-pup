#!/bin/bash
# Checks if the necessary environment variables are set

DIR=`dirname $0`
if [ -f "${DIR}/secrets.sh" ]; then
    echo Obtaining environment variables from "${DIR}/secrets.sh..."

    # Use `source` command since we want the variables defined in the current
    # shell environment, not a child process
    source "${DIR}/secrets.sh"

    # Generate the Run ID using a valid ObjectID string
    export RUN_ID=`node "${DIR}/generate-run.js"`
fi

# VARS=("TEST_INPUT_BUCKET" "TEST_FILE" "TEST_OUTPUT_BUCKET" "RUN_ID" \
#     "AWS_REGION" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" \
#     "MONGODB_URI" "MONGODB_USER" "MONGODB_PASS")

VARS="TEST_INPUT_BUCKET TEST_FILE TEST_OUTPUT_BUCKET RUN_ID \
      AWS_REGION AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY \
      MONGODB_URI MONGODB_USER MONGODB_PASS"

# Removed since this only works in `sh` and not `bash`:
# echo Vars: "${VARS[@]}"
# for i in "${VARS[@]}"; do

echo Vars: $VARS
for i in $VARS; do
    eval value=\$$i
    echo $i: $value

    if [ -z $value ]; then
        echo "Environment variable $i is not set"
        exit 1
    fi
done

echo "All environment variables are set!"