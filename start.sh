#!/bin/bash
set -e

echo "=========================================================="
echo "  D-HEALTH DOCKER STACK DEPLOYMENT & VERIFICATION"
echo "=========================================================="

# 1. Kiểm tra file .env
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# 2. Build & Khởi động Docker containers
echo "Starting PostgreSQL, MinIO, Backend API and Frontend..."
docker compose up -d --build

# 3. Chờ cơ sở dữ liệu và MinIO sẵn sàng
echo "Waiting for services to become healthy..."
docker compose ps

echo "=========================================================="
echo "  D-HEALTH SERVICES DEPLOYED SUCCESSFULLY!"
echo "=========================================================="
echo "  - Frontend Web Client:   http://localhost:7001"
echo "  - Backend API:           http://localhost:7002/api/health"
echo "  - PostgreSQL 16:         localhost:7003 (db: dhealth_db, user: dhealth_user)"
echo "  - MinIO S3 API:          http://localhost:7004"
echo "  - MinIO Web Console:     http://localhost:7005 (admin / dhealth_minio_secret_2026)"
echo "=========================================================="
