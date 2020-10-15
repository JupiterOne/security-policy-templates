output "s3_bucket_name" {
  value = aws_s3_bucket.security_policy_templates.id
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.security_policy_templates.arn
}
