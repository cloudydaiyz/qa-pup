#!/bin/bash

# Updates the artifacts folder with the lambda layer and functions source code
# (from /functions/node_modules and /functions/src respectively) and create the
# execution plan for the Terraform configuration in /cloud

# Run this to plan functions and/or lambda layer changes

# https://github.com/akshaykarle/terraform-provider-mongodbatlas/issues/12
terraform -chdir="cloud" taint mongodbatlas_cluster.main_cluster

terraform -chdir="cloud" plan \
  -var-file="terraform.tfvars"