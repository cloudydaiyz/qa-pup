#!/bin/bash

# Builds the container in /test-container

CONTAINER_DIR="`pwd`/`dirname $0`/../packages/qa-pup-test-container"
cd $CONTAINER_DIR
docker build -t qa-pup-test-container -f "${CONTAINER_DIR}/Dockerfile" $CONTAINER_DIR

if [ -f "${CONTAINER_DIR}/scripts/secrets.sh" ]; then
    echo Obtaining environment variables from "${CONTAINER_DIR}/scripts/secrets.sh..."

    # Use `source` command since we want the variables defined in the current
    # shell environment, not a child process
    source "${CONTAINER_DIR}/scripts/secrets.sh"

    tsc

    # Generate the Run ID using a valid ObjectID string
    export RUN_ID=`node "${CONTAINER_DIR}/scripts/generate-run.js"`
fi