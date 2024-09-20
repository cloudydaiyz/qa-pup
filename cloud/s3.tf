resource "aws_s3_bucket" "input_bucket" {
  bucket = local.test_input_bucket
}

resource "aws_s3_bucket_public_access_block" "public_input_bucket" {
  bucket = aws_s3_bucket.input_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "input_bucket_policy" {
  bucket = aws_s3_bucket.input_bucket.id
  policy = data.aws_iam_policy_document.input_bucket_policy.json

  depends_on = [ aws_s3_bucket_public_access_block.public_input_bucket ]
}

data "aws_iam_policy_document" "input_bucket_policy" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.input_bucket.arn}/*",
    ]
  }
}

resource "aws_s3_bucket" "output_bucket" {
  bucket = local.test_output_bucket
}

resource "aws_s3_bucket_lifecycle_configuration" "output_bucket" {
  bucket = aws_s3_bucket.output_bucket.id

  rule {
    id     = "expire_old_objects"
    status = "Enabled"

    expiration {
      days = var.test_lifetime
    }
  }
}

resource "aws_s3_bucket_public_access_block" "public_output_bucket" {
  bucket = aws_s3_bucket.output_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "output_bucket_policy" {
  bucket = aws_s3_bucket.output_bucket.id
  policy = data.aws_iam_policy_document.output_bucket_policy.json

  depends_on = [ aws_s3_bucket_public_access_block.public_output_bucket ]
}

data "aws_iam_policy_document" "output_bucket_policy" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.output_bucket.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_website_configuration" "output_bucket_website" {
  bucket = aws_s3_bucket.output_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}