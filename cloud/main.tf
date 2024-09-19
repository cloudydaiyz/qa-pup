terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "1.18.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

locals {
  test_input_bucket = "qa-pup-input"
  test_output_bucket = "qa-pup-output"
  ecs_cluster_name = "qa-pup-cluster"
  ecs_task_definition_name = "qa-pup-test"
}