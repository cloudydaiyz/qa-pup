#!/bin/bash

# Invokes the initialization lambda. Run this to clear the system.

DIR="`pwd`/`dirname $0`"

aws lambda invoke --function-name qa-pup-initialize "$DIR/../cloud/artifacts/output.txt"