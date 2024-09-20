#!/bin/bash

DIR="`pwd`/`dirname $0`"

source "$DIR/artifacts.sh"
terraform apply -var-file=variables.tfvars --auto-approve