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