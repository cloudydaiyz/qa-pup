#!/bin/bash

# Builds the container in /test-container

DIR="`dirname $0`/../test-container"
cd $DIR
docker build -t test-container -f "${DIR}/Dockerfile" $DIR

if [ -f "${DIR}/scripts/secrets.sh" ]; then
    echo Obtaining environment variables from "${DIR}/scripts/secrets.sh..."

    # Use `source` command since we want the variables defined in the current
    # shell environment, not a child process
    source "${DIR}/scripts/secrets.sh"

    tsc

    # Generate the Run ID using a valid ObjectID string
    export RUN_ID=`node "${DIR}/scripts/generate-run.js"`
fi