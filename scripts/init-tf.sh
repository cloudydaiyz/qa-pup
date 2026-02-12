#!/bin/bash

terraform -chdir="cloud" init \
  -backend-config="state.config" \
  -var-file="terraform.tfvars"