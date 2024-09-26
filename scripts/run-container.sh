#!/bin/bash

# Runs the container made by /test-container

docker run \
    -e TEST_INPUT_BUCKET="$TEST_INPUT_BUCKET" \
    -e TEST_FILE="$TEST_FILE" \
    -e TEST_OUTPUT_BUCKET="$TEST_OUTPUT_BUCKET" \
    -e AWS_REGION="$AWS_REGION" \
    -e AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
    -e AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
    -e MONGODB_URI="$MONGODB_URI" \
    -e MONGODB_USER="$MONGODB_USER" \
    -e MONGODB_PASS="$MONGODB_PASS" \
    -e RUN_ID="$RUN_ID" \
    qa-pup-test-container