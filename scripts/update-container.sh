#!/bin/bash

# Builds and runs the container in /test-container

DIR=$(realpath `dirname $0`)

source "${DIR}/build-container.sh"
source "${DIR}/run-container.sh"