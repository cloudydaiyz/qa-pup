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

variable "db_user" {
  type        = string
  description = "MongoDB database username"
}

variable "db_pass" {
  type        = string
  description = "MongoDB database password"
}

variable "sender_email" {
  type        = string
  description = "Email to send test completion emails from. Must be verified in SES."
}

variable "container_image" {
  type        = string
  description = "Docker container image to deploy."
}