terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC for hotel booking application
resource "aws_vpc" "hotel_booking_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "hotel-booking-vpc"
    Environment = var.environment
  }
}

# Public Subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.hotel_booking_vpc.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "hotel-booking-public-subnet"
  }
}

# Private Subnet
resource "aws_subnet" "private_subnet" {
  vpc_id            = aws_vpc.hotel_booking_vpc.id
  cidr_block        = var.private_subnet_cidr
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "hotel-booking-private-subnet"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "hotel_booking_igw" {
  vpc_id = aws_vpc.hotel_booking_vpc.id

  tags = {
    Name = "hotel-booking-igw"
  }
}

# Route Table for public subnet
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.hotel_booking_vpc.id

  route {
    cidr_block      = "0.0.0.0/0"
    gateway_id      = aws_internet_gateway.hotel_booking_igw.id
  }

  tags = {
    Name = "hotel-booking-public-rt"
  }
}

resource "aws_route_table_association" "public_rta" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# Security Group for ALB
resource "aws_security_group" "alb_sg" {
  name        = "hotel-booking-alb-sg"
  description = "Security group for hotel booking ALB"
  vpc_id      = aws_vpc.hotel_booking_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "hotel-booking-alb-sg"
  }
}

# Security Group for ECS
resource "aws_security_group" "ecs_sg" {
  name        = "hotel-booking-ecs-sg"
  description = "Security group for hotel booking ECS"
  vpc_id      = aws_vpc.hotel_booking_vpc.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "hotel-booking-ecs-sg"
  }
}

# Application Load Balancer
resource "aws_lb" "hotel_booking_alb" {
  name               = "hotel-booking-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_subnet.id, aws_subnet.private_subnet.id]

  tags = {
    Name = "hotel-booking-alb"
  }
}

# ALB Target Group
resource "aws_lb_target_group" "hotel_booking_tg" {
  name        = "hotel-booking-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.hotel_booking_vpc.id
  target_type = "ip"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    interval            = 30
    path                = "/"
    matcher             = "200"
  }

  tags = {
    Name = "hotel-booking-tg"
  }
}

# ALB Listener
resource "aws_lb_listener" "hotel_booking_listener" {
  load_balancer_arn = aws_lb.hotel_booking_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.hotel_booking_tg.arn
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "hotel_booking_logs" {
  name              = "/ecs/hotel-booking"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "hotel-booking-logs"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "hotel_booking_cluster" {
  name = "hotel-booking-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "hotel-booking-cluster"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "hotel_booking_task" {
  family                   = "hotel-booking-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory

  container_definitions = jsonencode([
    {
      name      = "hotel-booking-backend"
      image     = "${var.docker_image_backend}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.hotel_booking_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        }
      ]
    }
  ])

  tags = {
    Name = "hotel-booking-task"
  }
}

# ECS Service
resource "aws_ecs_service" "hotel_booking_service" {
  name            = "hotel-booking-service"
  cluster         = aws_ecs_cluster.hotel_booking_cluster.id
  task_definition = aws_ecs_task_definition.hotel_booking_task.arn
  desired_count   = var.ecs_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private_subnet.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.hotel_booking_tg.arn
    container_name   = "hotel-booking-backend"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.hotel_booking_listener]

  tags = {
    Name = "hotel-booking-service"
  }
}

# Data source for availability zones
data "aws_availability_zones" "available" {
  state = "available"
}
