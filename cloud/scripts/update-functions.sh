#!/bin/bash
# Copies over the controllers and node_modules to the artifacts directory to prepare for deployment

DIR="`pwd`/`dirname $0`"
CLOUD_DIR="$DIR/.."
FUNCTIONS_DIR="$DIR/../../functions"
ARTIFACTS_DIR="$DIR/../artifacts"

mkdir -p "$ARTIFACTS_DIR/layer/nodejs/node20"
cd $FUNCTIONS_DIR
rm -rf node_modules
npm i --omit=dev
cp -r node_modules "$ARTIFACTS_DIR/layer/nodejs/node20"

npm i
npm run build
cp -r controllers "$ARTIFACTS_DIR"

cd $CLOUD_DIR
terraform plan -var-file=variables.tfvars