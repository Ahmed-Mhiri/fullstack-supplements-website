# File: main.tf
provider "aws" {
  region = "eu-central-1"
}

variable "aws_key_name" {
  description = "Name of the SSH key pair for the suppstore project"
  default     = "suppstore"
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_security_group" "suppstore_sg" {
  name        = "suppstore-server-sg"
  description = "Allow SSH traffic for setup and management"

  # Allow inbound SSH traffic from any IP
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic from the server
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "suppstore_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro" # Free Tier eligible
  key_name      = var.aws_key_name
  security_groups = [aws_security_group.suppstore_sg.name]
  
  # This script runs on the first boot to prepare the server
  user_data = <<-EOF
              #!/bin/bash
              # Update and install Docker
              apt-get update -y
              apt-get install -y apt-transport-https ca-certificates curl software-properties-common
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
              echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
              apt-get update -y
              apt-get install -y docker-ce docker-ce-cli containerd.io

              # Add ubuntu user to the docker group
              usermod -aG docker ubuntu

              # Install Docker Compose
              LATEST_COMPOSE=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'browser_download_url' | grep 'docker-compose-linux-x86_64"' | cut -d'"' -f4)
              curl -L $LATEST_COMPOSE -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose

              # Install Cloudflare Tunnel
              curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
              dpkg -i cloudflared.deb
              
              # Create a directory for the app
              mkdir -p /home/ubuntu/app
              chown -R ubuntu:ubuntu /home/ubuntu/app
              EOF

  tags = {
    Name = "Suppstore-Server"
  }
}

resource "aws_eip" "suppstore_ip" {
  instance = aws_instance.suppstore_server.id
  domain   = "vpc"
}

output "public_ip" {
  value = aws_eip.suppstore_ip.public_ip
}