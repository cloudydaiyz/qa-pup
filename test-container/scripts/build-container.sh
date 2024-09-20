#!/bin/bash

DIR=`dirname $0`
docker build -t test-container -f "${DIR}/../Dockerfile" "${DIR}/.."

if [ -f "${DIR}/secrets.sh" ]; then
    echo Obtaining environment variables from "${DIR}/secrets.sh..."

    # Use `source` command since we want the variables defined in the current
    # shell environment, not a child process
    source "${DIR}/secrets.sh"

    cd "${DIR}/.."
    tsc

    # Generate the Run ID using a valid ObjectID string
    export RUN_ID=`node "${DIR}/generate-run.js"`
fi