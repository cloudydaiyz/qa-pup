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

data "aws_caller_identity" "current" { }

locals {
  account_id = data.aws_caller_identity.current.account_id
  container_image = "cloudydaiyz/qa-pup-test-container:1.0.2"
  test_input_bucket = "qa-pup-input"
  test_output_bucket = "qa-pup-output"
  ecs_cluster = "qa-pup-cluster"
  ecs_task_definition= "qa-pup-test"
  test_completion_lock = "/qa-pup/test-completion-lock"
  functions = toset(["api", "initialize", "scheduled-tasks", "test-monitor"])
  functions_base_env = {
    MONGODB_URI = ""
    MONGODB_USER = var.db_user
    MONGODB_PASS = var.db_pass
  }
}

# For resources
provider "aws" {
  region  = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_access_key
}