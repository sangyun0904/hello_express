terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "ap-northeast-2"
}

# Create a VPC
resource "aws_vpc" "node-vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "node VPC"
  }
}

resource "aws_subnet" "public_subnets" {
    count               = length(var.public_subnet_cidrs)
    vpc_id              = aws_vpc.node-vpc.id
    cidr_block          = element(var.public_subnet_cidrs, count.index)
    availability_zone   = element(var.azs, count.index)

    tags = {
        Name = "Public Subnet ${count.index + 1}"
    }
}

resource "aws_subnet" "private_subnets" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.node-vpc.id
  cidr_block        = element(var.private_subnet_cidrs, count.index)
  availability_zone = element(var.azs, count.index)

  tags = {
    Name = "Private Subnet ${count.index + 1}"
  }
}

resource "aws_internet_gateway" "node-gw" {
    vpc_id = aws_vpc.node-vpc.id 

    tags = {
        Name = "VPC IG"
    }
}

resource "aws_route_table" "node-rt" {
    vpc_id = aws_vpc.node-vpc.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.node-gw.id
    }
}

resource "aws_route_table_association" "public_subnet_asso" {
    count          = length(var.public_subnet_cidrs)
    subnet_id      = element(aws_subnet.public_subnets[*].id, count.index)
    route_table_id = aws_route_table.node-rt.id
}

resource "aws_nat_gateway" "nat-gateway" {
    subnet_id     = aws_subnet.public_subnets[0].id

    tags = {
        Name = "gw NAT"
    }

    # To ensure proper ordering, it is recommended to add an explicit dependency
    # on the Internet Gateway for the VPC.
    depends_on = [aws_internet_gateway.node-gw]
}