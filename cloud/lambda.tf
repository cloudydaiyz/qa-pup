# Lambda Functions and Policies

data "archive_file" "layer" {
  type        = "zip"
  source_dir  = "${path.module}/artifacts/layer"
  output_path = "${path.module}/artifacts/layer/layer.zip"
}

data "archive_file" "function" {
  for_each = local.functions

  type        = "zip"
  source_file = "${path.module}/artifacts/controllers/${each.key}.mjs"
  output_path = "${path.module}/artifacts/controllers/${each.key}.zip"
}

resource "aws_lambda_layer_version" "lambda_layer" {
  filename   = data.archive_file.layer.output_path
  layer_name = "qa-pup-functions"

  compatible_runtimes = ["nodejs20.x"]
  source_code_hash    = data.archive_file.layer.output_base64sha256
}

# Assume role policy for the IAM role of any lambda
data "aws_iam_policy_document" "functions_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# == API Controller Lambda ==

data "aws_iam_policy_document" "api" {
  statement {
    actions   = ["logs:CreateLogGroup"]
    resources = ["arn:aws:logs:${var.aws_region}:${local.account_id}:*"]
  }

  statement {
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:${var.aws_region}:${local.account_id}:log-group:/aws/lambda/qa-pup-api:*"]
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = ["arn:aws:s3:::${local.test_input_bucket}"]
  }

  statement {
    actions   = [
      "ses:VerifyEmailIdentity",
      "ses:GetIdentityVerificationAttributes"
    ]
    resources = ["*"]
  }

  statement {
    actions   = ["iam:PassRole"]
    resources = [aws_iam_role.ecs_tasks_execution_role.arn]
  }

  statement {
    actions   = ["ecs:RunTask"]
    resources = [aws_ecs_task_definition.test_task_definition.arn]
  }
}

resource "aws_iam_role" "api" {
  name = "api-function"

  assume_role_policy = data.aws_iam_policy_document.functions_assume_role.json

  inline_policy {
    name   = "lambda_policy"
    policy = data.aws_iam_policy_document.api.json
  }
}

resource "aws_lambda_function" "api" {
  function_name    = "qa-pup-api"
  filename         = data.archive_file.function["api"].output_path
  description      = "API controller for QA Pup project"
  role             = aws_iam_role.api.arn
  handler          = "api.handler"
  source_code_hash = data.archive_file.function["api"].output_base64sha256
  layers           = [aws_lambda_layer_version.lambda_layer.arn]
  timeout          = 20

  runtime = "nodejs20.x"

  environment {
    variables = merge(local.functions_base_env, {
      TEST_INPUT_BUCKET        = local.test_input_bucket
      ECS_CLUSTER_NAME         = local.ecs_cluster
      ECS_TASK_DEFINITION_NAME = local.ecs_task_definition
    })
  }

  tags = {
    project = "qa-pup"
  }
}

# == Scheduled Tasks Lambda ==

data "aws_iam_policy_document" "scheduled_tasks" {
  statement {
    actions = [
      "logs:CreateLogGroup"
    ]
    resources = [
      "arn:aws:logs:${var.aws_region}:${local.account_id}:*"
    ]
  }

  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "arn:aws:logs:${var.aws_region}:${local.account_id}:log-group:/aws/lambda/qa-pup-scheduled-tasks:*"
    ]
  }

  statement {
    actions = [
      "s3:ListBucket"
    ]
    resources = [
      "arn:aws:s3:::${local.test_input_bucket}"
    ]
  }

  statement {
    actions = [
      "iam:PassRole"
    ]
    resources = [aws_iam_role.ecs_tasks_execution_role.arn]
  }

  statement {
    actions = [
      "ecs:RunTask"
    ]
    resources = [aws_ecs_task_definition.test_task_definition.arn]
  }
}

resource "aws_iam_role" "scheduled_tasks" {
  name = "scheduled-tasks-function"

  assume_role_policy = data.aws_iam_policy_document.functions_assume_role.json

  inline_policy {
    name   = "lambda_policy"
    policy = data.aws_iam_policy_document.scheduled_tasks.json
  }
}

resource "aws_lambda_function" "scheduled_tasks" {
  function_name    = "qa-pup-scheduled-tasks"
  filename         = data.archive_file.function["scheduled-tasks"].output_path
  description      = "Scheduled tasks for QA Pup project"
  role             = aws_iam_role.scheduled_tasks.arn
  handler          = "scheduled-tasks.handler"
  source_code_hash = data.archive_file.function["scheduled-tasks"].output_base64sha256
  layers           = [aws_lambda_layer_version.lambda_layer.arn]
  timeout          = 20

  runtime = "nodejs20.x"

  environment {
    variables = merge(local.functions_base_env, {
      RAW_TEST_LIFETIME        = tostring(var.test_lifetime * 24 * 60 * 60 * 1000)
      TEST_INPUT_BUCKET        = local.test_input_bucket
      ECS_CLUSTER_NAME         = local.ecs_cluster
      ECS_TASK_DEFINITION_NAME = local.ecs_task_definition
    })
  }

  tags = {
    project = "qa-pup"
  }
}

# == Test Monitor Lambda ==

data "aws_iam_policy_document" "test_monitor" {
  statement {
    actions = [
      "logs:CreateLogGroup"
    ]
    resources = [
      "arn:aws:logs:${var.aws_region}:${local.account_id}:*"
    ]
  }

  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "arn:aws:logs:${var.aws_region}:${local.account_id}:log-group:/aws/lambda/qa-pup-test-monitor:*"
    ]
  }

  statement {
    actions = [
      "ssm:PutParameter",
      "ssm:GetParameter"
    ]
    resources = [
      "arn:aws:ssm:${var.aws_region}:${local.account_id}:parameter${local.test_completion_lock}"
    ]
  }

  statement {
    actions = [
      "ses:DeleteIdentity",
      "ses:GetIdentityVerificationAttributes"
    ]
    resources = ["*"]
  }

  statement {
    actions = [
      "ses:SendEmail"
    ]
    resources = [
      "arn:aws:ses:${var.aws_region}:${local.account_id}:identity/*",
    ]
  }

  statement {
    actions = [
      "ecs:ListTasks",
      "ecs:DescribeTasks"
    ]
    resources = [
      "arn:aws:ecs:${var.aws_region}:${local.account_id}:task/${local.ecs_cluster}/*",
      "arn:aws:ecs:${var.aws_region}:${local.account_id}:container-instance/${local.ecs_cluster}/*",
    ]
  }
}

resource "aws_iam_role" "test_monitor" {
  name = "test-monitor-function"

  assume_role_policy = data.aws_iam_policy_document.functions_assume_role.json

  inline_policy {
    name   = "lambda_policy"
    policy = data.aws_iam_policy_document.test_monitor.json
  }
}

resource "aws_lambda_function" "test_monitor" {
  function_name    = "qa-pup-test-monitor"
  filename         = data.archive_file.function["test-monitor"].output_path
  description      = "Test monitor for QA Pup project"
  role             = aws_iam_role.test_monitor.arn
  handler          = "test-monitor.handler"
  source_code_hash = data.archive_file.function["test-monitor"].output_base64sha256
  layers           = [aws_lambda_layer_version.lambda_layer.arn]
  timeout          = 20

  runtime = "nodejs20.x"

  environment {
    variables = merge(local.functions_base_env, {
      ECS_CLUSTER_NAME     = local.ecs_cluster
      TEST_COMPLETION_LOCK = local.test_completion_lock
      SENDER_EMAIL         = var.sender_email
    })
  }

  tags = {
    project = "qa-pup"
  }
}

# == Init Lambda ==

data "aws_iam_policy_document" "initialize" {
  statement {
    actions = [
      "logs:CreateLogGroup"
    ]
    resources = [
      "arn:aws:logs:${var.aws_region}:${local.account_id}:*"
    ]
  }

  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "arn:aws:logs:${var.aws_region}:${local.account_id}:log-group:/aws/lambda/qa-pup-initialize:*"
    ]
  }

  statement {
    actions = [
      "ses:VerifyEmailIdentity"
    ]
    resources = ["*"]
  }

  statement {
    actions = [
      "s3:ListBucket",
      "s3:DeleteObject"
    ]
    resources = [
      "arn:aws:s3:::${local.test_output_bucket}",
      "arn:aws:s3:::${local.test_output_bucket}/*"
    ]
  }
}

resource "aws_iam_role" "initialize" {
  name = "initialize-function"

  assume_role_policy = data.aws_iam_policy_document.functions_assume_role.json

  inline_policy {
    name   = "lambda_policy"
    policy = data.aws_iam_policy_document.initialize.json
  }
}

resource "aws_lambda_function" "initialize" {
  function_name    = "qa-pup-initialize"
  filename         = data.archive_file.function["initialize"].output_path
  description      = "Initialization for QA Pup project"
  role             = aws_iam_role.initialize.arn
  handler          = "initialize.handler"
  source_code_hash = data.archive_file.function["initialize"].output_base64sha256
  layers           = [aws_lambda_layer_version.lambda_layer.arn]
  timeout          = 20

  runtime = "nodejs20.x"

  environment {
    variables = merge(local.functions_base_env, {
      TEST_OUTPUT_BUCKET        = local.test_output_bucket
      SENDER_EMAIL = var.sender_email
    })
  }

  tags = {
    project = "qa-pup"
  }
}