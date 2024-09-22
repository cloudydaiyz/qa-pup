#!/bin/bash

# Updates the artifacts folder with the lambda layer and functions source code
# (from /functions/node_modules and /functions/src respectively) and create the
# execution plan for the Terraform configuration in /cloud

# Run this to plan functions and/or lambda layer changes

DIR="`pwd`/`dirname $0`"

source "$DIR/artifacts.sh"
terraform plan -var-file=variables.tfvars