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

# 2. Clear toàn bộ container cũ
echo "Stopping and clearing old containers..."
docker compose down --remove-orphans || true
docker rm -f dhealth-frontend dhealth-backend dhealth-postgres dhealth-minio dhealth-minio-init 2>/dev/null || true

# 3. Build & Khởi động Docker containers mới
echo "Starting PostgreSQL, MinIO, Backend API and Frontend..."
docker compose up -d --build --force-recreate

# 4. Dọn dẹp images rác
docker image prune -f || true

# 5. Chờ và kiểm tra trạng thái
echo "Checking live status of services..."
docker compose ps

echo "=========================================================="
echo "  D-HEALTH SERVICES DEPLOYED SUCCESSFULLY!"
echo "=========================================================="
echo "  - Frontend Web Client:   http://localhost:7101"
echo "  - Backend API:           http://localhost:7102/api/health"
echo "  - PostgreSQL 16:         localhost:7103 (db: dhealth_db, user: dhealth_user)"
echo "  - MinIO S3 API:          http://localhost:7104"
echo "  - MinIO Web Console:     http://localhost:7105 (admin / dhealth_minio_secret_2026)"
echo "=========================================================="
