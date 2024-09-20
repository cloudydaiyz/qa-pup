#!/bin/bash

DIR="`pwd`/`dirname $0`"

source "$DIR/artifacts.sh"
terraform plan -var-file=variables.tfvars