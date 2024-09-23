#!/bin/bash

# Copies over the controllers and node_modules to the artifacts directory to prepare for deployment
# Used by `apply.sh` and `plan.sh`

DIR="`pwd`/`dirname $0`"
ARTIFACTS_DIR="$DIR/../cloud/artifacts"

mkdir -p "$ARTIFACTS_DIR/layer/nodejs/node20"
cd "$DIR/../functions"
rm -rf node_modules
npm i --omit=dev
cp -r node_modules "$ARTIFACTS_DIR/layer/nodejs/node20"

npm i
npm run build
cp -r controllers "$ARTIFACTS_DIR"

cd "$DIR/../cloud"