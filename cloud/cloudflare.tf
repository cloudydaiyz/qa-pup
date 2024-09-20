data "cloudflare_zone" "root" {
  name = "cloudydaiyz.com"
}

resource "cloudflare_record" "acm" {
  zone_id = data.cloudflare_zone.root.id
  name    = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_name
  type    = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_type
  content = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_value
  ttl     = 1
}

resource "cloudflare_record" "api" {
  zone_id = data.cloudflare_zone.root.id
  name    = "api.qa-pup"
  type    = "CNAME"
  content = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].target_domain_name
  ttl     = 1
}