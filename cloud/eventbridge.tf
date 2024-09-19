resource "aws_cloudwatch_event_rule" "test_container" {
  name        = "test-container-update"
  description = "Records changes in ECS test container status for QA Pup."

  event_pattern = jsonencode({
    source = ["aws.ecs"]
    detail-type = ["ECS Task State Change"]
    detail = {
        clusterArn = [ aws_ecs_cluster.cluster.arn ]
        containers = {
            lastStatus = ["STOPPED"]
        }
    }
  })
}

resource "aws_cloudwatch_event_target" "test_monitor" {
  rule      = aws_cloudwatch_event_rule.test_container.name
  arn       = aws_lambda_function.test_monitor.arn
}

# TODO: Add scheduled tasks