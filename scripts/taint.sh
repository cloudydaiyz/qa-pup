#!/bin/bash

# May need to run this after applying
# See more: https://github.com/akshaykarle/terraform-provider-mongodbatlas/issues/12

terraform -chdir="cloud" taint mongodbatlas_cluster.main_cluster