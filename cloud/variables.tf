variable "db_user" {
  type        = string
  description = "description"
}

variable "db_pass" {
  type        = string
  description = "description"
}

variable "sender_email" {
  type        = string
  description = "Email to send test completion emails from. Must be verified in SES."
}