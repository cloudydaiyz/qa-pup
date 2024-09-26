#!/bin/bash

# Copies over the controllers and node_modules to the artifacts directory to prepare for deployment
# Used by `apply.sh` and `plan.sh`

DIR="`pwd`/`dirname $0`"
CLOUD_DIR="$DIR/../cloud"
ARTIFACTS_DIR="$CLOUD_DIR/artifacts"
FUNCTIONS_DIR="$DIR/../packages/qa-pup-functions"

mkdir -p "$ARTIFACTS_DIR/layer/nodejs/node20"
cd $FUNCTIONS_DIR
rm -rf node_modules
npm i --omit=dev
cp -r node_modules "$ARTIFACTS_DIR/layer/nodejs/node20"

npm i
npm run build
cp -r controllers "$ARTIFACTS_DIR"

cd $CLOUD_DIR