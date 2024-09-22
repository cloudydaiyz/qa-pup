#!/bin/bash

DIR="`pwd`/`dirname $0`"

aws lambda invoke --function-name qa-pup-initialize "$DIR/../artifacts/output.txt"