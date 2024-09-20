variable "aws_access_key" {
  type        = string
  description = "AWS access key"
}

variable "aws_secret_access_key" {
  type        = string
  description = "AWS secret access key"
}

variable "aws_region" {
  type        = string
  description = "AWS region to deploy resources in."
}

variable "cloudflare_api_token" {
    type = string
    description = "API token for Cloudflare"
}

variable "mongodb_public_key" {
  type        = string
  description = "public API key from mongodb atlas organization"
}

variable "mongodb_private_key" {
  type        = string
  description = "private API key from mongodb atlas organization"
}

variable "mongodb_project_owner_id" {
  type        = string
  description = "ID of the user to be assigned as the project owner"
}

variable "mongodb_region" {
  type        = string
  description = "the region of the cluster to be created; should reflect aws region, see https://www.mongodb.com/docs/atlas/reference/amazon-aws/"
}

variable "mongodb_user" {
  type        = string
  description = "MongoDB database username"
}

variable "mongodb_pass" {
  type        = string
  description = "MongoDB database password"
}

variable "sender_email" {
  type        = string
  description = "Email to send test completion emails from. Must be verified in SES."
}

variable "test_lifetime" {
  type        = number
  description = "Lifetime of test data in days."
  default = 7
}