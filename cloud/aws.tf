resource "aws_ssm_parameter" "test_completion_lock" {
  name  = local.test_completion_lock
  type  = "String"
  value = "OFF"
}

resource "aws_ssm_parameter" "access_key" {
  name  = "/qa-pup/access-key"
  type  = "String"
  value = var.aws_access_key
}

resource "aws_ssm_parameter" "secret_key" {
  name  = "/qa-pup/secret-key"
  type  = "String"
  value = var.aws_secret_access_key
}

resource "aws_ssm_parameter" "region" {
  name  = "/qa-pup/region"
  type  = "String"
  value = var.aws_region
}

resource "aws_ssm_parameter" "db_user" {
  name  = "/qa-pup/db-user"
  type  = "String"
  value = var.db_user
}

resource "aws_ssm_parameter" "db_pass" {
  name  = "/qa-pup/db-pass"
  type  = "String"
  value = var.db_pass
}