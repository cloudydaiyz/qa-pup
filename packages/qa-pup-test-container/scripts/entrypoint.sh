#!/usr/bin/env bash

DIR=`dirname $0`

# Entrypoint for the docker container
echo "Entrypoint started"
source "${DIR}/check-env.sh"
npm test