resource "aws_cloudwatch_event_rule" "test_container" {
  name        = "test-container-update"
  description = "Records changes in ECS test container status for QA Pup."

  event_pattern = jsonencode({
    source      = ["aws.ecs"]
    detail-type = ["ECS Task State Change"]
    detail = {
      clusterArn = [aws_ecs_cluster.cluster.arn]
      containers = {
        lastStatus = ["STOPPED"]
      }
    }
  })
}

resource "aws_cloudwatch_event_target" "test_monitor" {
  rule = aws_cloudwatch_event_rule.test_container.name
  arn  = aws_lambda_function.test_monitor.arn
}

resource "aws_lambda_permission" "test_container_rule" {
  statement_id  = "AllowTestMonitorInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.test_monitor.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.test_container.arn
}

# TODO: Add scheduled tasks

# Assume role policy for the IAM role of any schedule
data "aws_iam_policy_document" "scheduler_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["scheduler.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "scheduler" {
  statement {
    actions = ["lambda:InvokeFunction"]
    resources = [aws_lambda_function.scheduled_tasks.arn, "${aws_lambda_function.scheduled_tasks.arn}:*"]
  }
}

resource "aws_iam_role" "scheduled_tasks_schedule" {
  name = "scheduled-tasks-scheduler"

  assume_role_policy = data.aws_iam_policy_document.scheduler_assume_role.json

  inline_policy {
    name   = "scheduler_policy"
    policy = data.aws_iam_policy_document.scheduler.json
  }
}

locals {
  scheduled_run_cron = "0 13 * * ? *"
  scheduled_run_payload = jsonencode({
    cron = local.scheduled_run_cron,
    task = "run"
  })
  scheduled_cleanup_cron = "0 13 * * ? *"
  scheduled_cleanup_payload = jsonencode({
    cron = local.scheduled_cleanup_cron,
    task = "cleanup"
  })
}

resource "aws_scheduler_schedule" "run" {
  name = "qa-pup-scheduled-run"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "cron(${local.scheduled_run_cron})"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:lambda:invoke"
    role_arn = aws_iam_role.scheduled_tasks_schedule.arn

    input = jsonencode({
      FunctionName = aws_lambda_function.scheduled_tasks.arn,
      InvocationType = "Event",
      Payload = local.scheduled_run_payload
    })
  }
}

resource "aws_scheduler_schedule" "cleanup" {
  name = "qa-pup-scheduled-cleanup"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "cron(${local.scheduled_cleanup_cron})"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:lambda:invoke"
    role_arn = aws_iam_role.scheduled_tasks_schedule.arn

    input = jsonencode({
      FunctionName = aws_lambda_function.scheduled_tasks.arn,
      InvocationType = "Event",
      Payload = local.scheduled_cleanup_payload
    })
  }
}