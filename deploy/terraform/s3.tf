resource "aws_s3_bucket" "security_policy_templates" {
  bucket = "${var.deploy_config.environment}-security-policy-templates"
  acl    = "private"
  tags = {
    Project        = var.deploy_config.project
    Classification = "internal"
    Description    = "bucket that copies the source from security-policy-templates in GitHub"
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "AES256"
      }
    }
  }
}
