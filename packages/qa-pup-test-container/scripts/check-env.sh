#!/usr/bin/env bash
# Checks if the necessary environment variables are set

DIR=`dirname $0`

# Obtain env vars from the secrets.sh file if it exists
if [ -f "${DIR}/secrets.sh" ]; then
    echo Obtaining environment variables from "${DIR}/secrets.sh..."

    # Use `source` command since we want the variables defined in the current
    # shell environment, not a child process
    source "${DIR}/secrets.sh"

    # Generate the Run ID using a valid ObjectID string
    export RUN_ID=`node "${DIR}/generate-run.js"`
fi

# Check if the necessary environment variables are set
VARS="TEST_INPUT_BUCKET TEST_FILE TEST_OUTPUT_BUCKET RUN_ID \
      AWS_REGION AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY \
      MONGODB_URI MONGODB_USER MONGODB_PASS"

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