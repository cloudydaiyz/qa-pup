#!/bin/bash

# Updates the artifacts folder with the lambda layer and functions source code
# (from /functions/node_modules and /functions/src respectively) and create the
# execution plan for the Terraform configuration in /cloud

# Run this to plan functions and/or lambda layer changes

terraform -chdir="cloud" plan \
  -var-file="terraform.tfvars"