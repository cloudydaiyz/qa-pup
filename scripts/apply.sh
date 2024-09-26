#!/bin/bash

# Updates the artifacts folder with the lambda layer and functions source code
# (from /functions/node_modules and /functions/src respectively) and applies the
# Terraform configuration in /cloud

# Run this to initialize functions and lambda layer, or to update functions 

DIR=$(realpath `dirname $0`)

source "$DIR/artifacts.sh"
terraform apply -var-file=variables.tfvars --auto-approve