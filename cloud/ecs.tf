data "aws_iam_policy_document" "ecs_tasks_execution_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# Create the ECS task execution role
# This role is used by the ECS agent on the container instance to:
# - pull container images
# - obtain secrets from SSM
# - publish container logs to CloudWatch Logs.
resource "aws_iam_role" "ecs_tasks_execution_role" {
  name               = "ecs-task-execution-role"
  assume_role_policy = "${data.aws_iam_policy_document.ecs_tasks_execution_assume_role.json}"
}

resource "aws_iam_role_policy_attachment" "ecs_tasks_execution_role" {
  role       = aws_iam_role.ecs_tasks_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "get_ssm_secrets" {
  statement {
    actions = [
      "ssm:GetParameter",
      "ssm:GetParameters",
      "ssm:GetParametersByPath"
    ]

    resources = [
      aws_ssm_parameter.test_completion_lock.arn,
      aws_ssm_parameter.db_user.arn,
      aws_ssm_parameter.db_pass.arn,
      aws_ssm_parameter.region.arn,
      aws_ssm_parameter.access_key.arn,
      aws_ssm_parameter.secret_key.arn
    ]
  }

  statement {
    actions = [
      "logs:CreateLogGroup"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "get_params" {
  name = "qa-pup-ecs-test-get-params"
  description = "Allows test containers to get parameters from SSM"
  policy = data.aws_iam_policy_document.get_ssm_secrets.json
}

resource "aws_iam_role_policy_attachment" "get_params" {
  role       = aws_iam_role.ecs_tasks_execution_role.name
  policy_arn = aws_iam_policy.get_params.arn
}

resource "aws_ecs_cluster" "cluster" {
  name = local.ecs_cluster
}

resource "aws_ecs_task_definition" "test_task_definition" {
  family = local.ecs_task_definition
  container_definitions = jsonencode([
    {
      name      = "test-container"
      image     = local.container_image
      essential = true
      cpu       = 0
      environment = [
        {
          name = "TEST_INPUT_BUCKET"
          value = local.test_input_bucket
        },
        {
          name = "TEST_OUTPUT_BUCKET"
          value = local.test_output_bucket
        },
        {
          name = "MONGODB_URI"
          value = local.functions_base_env.MONGODB_URI
        }
      ]
      secrets = [
        {
          name = "TEST_COMPLETION_LOCK"
          valueFrom = aws_ssm_parameter.test_completion_lock.arn
        },
        {
          name = "MONGODB_USER"
          valueFrom = aws_ssm_parameter.db_user.arn
        },
        {
          name = "MONGODB_PASS"
          valueFrom = aws_ssm_parameter.db_pass.arn
        },
        {
          name = "AWS_REGION"
          valueFrom = aws_ssm_parameter.region.arn
        },
        {
          name = "AWS_ACCESS_KEY_ID"
          valueFrom = aws_ssm_parameter.access_key.arn
        },
        {
          name = "AWS_SECRET_ACCESS_KEY"
          valueFrom = aws_ssm_parameter.secret_key.arn
        }
      ]
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-create-group = "true"
          awslogs-group = "/ecs/${local.ecs_task_definition}"
          awslogs-region = var.aws_region
          awslogs-stream-prefix = "ecs"
          max-buffer-size = "25m"
          mode = "non-blocking"
        }
      }
    }
  ])

  execution_role_arn = aws_iam_role.ecs_tasks_execution_role.arn
  requires_compatibilities = [ "FARGATE" ]
  cpu = 1024
  memory = 3072
  network_mode = "awsvpc"

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture = "ARM64"
  }
}