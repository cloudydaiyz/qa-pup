resource "aws_apigatewayv2_api" "http_api" {
  name          = "qa-pup-api"
  protocol_type = "HTTP"
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_deployment" "http_api_deployment" {
  api_id = aws_apigatewayv2_api.http_api.id
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "api_lambda" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.api.invoke_arn
  description            = "API for QA Pup"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_route" "get_dashboard_path" {
  for_each = toset([ "GET", "OPTIONS" ])
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "${each.key} /dashboard"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
}

resource "aws_apigatewayv2_route" "get_test_run" {
  for_each = toset([ "GET", "OPTIONS" ])
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "${each.key} /run/{runId}/{name}"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
}

resource "aws_apigatewayv2_route" "get_test_run_metadata" {
  for_each = toset([ "GET", "OPTIONS" ])
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "${each.key} /run/{runFileId}/metadata"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
}

resource "aws_apigatewayv2_route" "post_manual_run" {
  for_each = toset([ "POST", "OPTIONS" ])
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "${each.key} /manual-run"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
}

resource "aws_apigatewayv2_route" "post_check_email" {
  for_each = toset([ "POST", "OPTIONS" ])
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "${each.key} /check-email"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
}

resource "aws_apigatewayv2_route" "post_verify_email" {
  for_each = toset([ "POST", "OPTIONS" ])
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "${each.key} /verify-email"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
}

resource "aws_apigatewayv2_route" "post_add_email" {
  for_each = toset([ "POST", "OPTIONS" ])
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "${each.key} /add-email"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
}

# Domain name configuration

resource "aws_acm_certificate" "cert" {
  domain_name       = "api.qa-pup.cloudydaiyz.com"
  validation_method = "DNS"
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn = aws_acm_certificate.cert.arn
}

resource "aws_apigatewayv2_domain_name" "api" {
  domain_name = "api.qa-pup.cloudydaiyz.com"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.cert.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "mapping" {
  api_id      = aws_apigatewayv2_api.http_api.id
  domain_name = aws_apigatewayv2_domain_name.api.id
  stage       = aws_apigatewayv2_stage.default.id
}