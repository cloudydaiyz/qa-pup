#!/bin/sh

# Use this file to generate your own `secrets.sh` file to make running the
# docker container easier. This file (`secrets.sh`) is ignored by git so you can 
# safely store your secrets here.

export TEST_INPUT_BUCKET="..." TEST_FILE="..." TEST_OUTPUT_BUCKET="..."
export AWS_REGION="..." AWS_ACCESS_KEY_ID="..." AWS_SECRET_ACCESS_KEY="..."
export MONGODB_URI="..." MONGODB_USER="..." MONGODB_PASS="..."