#!/bin/bash

# Builds and runs the container in /test-container

THIS_DIR="`pwd`/`dirname $0`"

source "${THIS_DIR}/build-container.sh"
source "${THIS_DIR}/run-container.sh"