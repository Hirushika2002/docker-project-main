output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.hotel_booking_alb.dns_name
}

output "alb_arn" {
  description = "ARN of the load balancer"
  value       = aws_lb.hotel_booking_alb.arn
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.hotel_booking_cluster.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.hotel_booking_service.name
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.hotel_booking_vpc.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public_subnet.id
}

output "private_subnet_id" {
  description = "ID of the private subnet"
  value       = aws_subnet.private_subnet.id
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.hotel_booking_logs.name
}

output "application_url" {
  description = "URL to access the hotel booking application"
  value       = "http://${aws_lb.hotel_booking_alb.dns_name}"
}
