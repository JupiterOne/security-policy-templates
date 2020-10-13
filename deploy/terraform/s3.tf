resource "aws_s3_bucket" "security_policy_templates" {
  bucket = "${var.target_name}-security-policy-templates"
  acl    = "private"
}
