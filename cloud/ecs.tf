data "aws_iam_policy_document" "ecs_tasks_execution_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_tasks_execution_role" {
  name               = "ecs-task-execution-role"
  assume_role_policy = "${data.aws_iam_policy_document.ecs_tasks_execution_assume_role.json}"
}

resource "aws_iam_role_policy_attachment" "ecs_tasks_execution_role" {
  role       = "${aws_iam_role.ecs_tasks_execution_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
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
          name = "AWS_ACCESS_KEY"
          valueFrom = aws_ssm_parameter.access_key.arn
        },
        {
          name = "AWS_SECRET_ACCESS_KEY"
          valueFrom = aws_ssm_parameter.secret_key.arn
        }
      ]
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