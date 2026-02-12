#!/bin/bash

# Updates the artifacts folder with the lambda layer and functions source code
# (from /functions/node_modules and /functions/src respectively) and applies the
# Terraform configuration in /cloud

# Run this to initialize functions and lambda layer, or to update functions 

# https://github.com/akshaykarle/terraform-provider-mongodbatlas/issues/12
terraform -chdir="cloud" taint mongodbatlas_cluster.main_cluster

terraform -chdir="cloud" apply \
  -var-file="terraform.tfvars" \
  --auto-approve