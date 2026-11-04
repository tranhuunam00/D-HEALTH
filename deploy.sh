#!/usr/bin/env bash
# ====================================================================
# D-HEALTH: Script tự động triển khai và cấu hình một chạm trên Server
# ====================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}====================================================================${NC}"
echo -e "${BLUE}        D-HEALTH: SCRIPT TỰ ĐỘNG TRIỂN KHAI MÁY CHỦ (ALL-IN-ONE)    ${NC}"
echo -e "${BLUE}====================================================================${NC}"

# 1. Kiểm tra docker và docker compose
if ! command -v docker >/dev/null 2>&1; then
    echo -e "${RED}[LỖI] Docker chưa được cài đặt trên máy chủ.${NC}"
    exit 1
fi

# 2. Tạo .env nếu chưa có
if [ ! -f .env ]; then
    echo -e "${YELLOW}[1/4] Khởi tạo .env từ .env.example...${NC}"
    cp .env.example .env
fi

# 3. Kéo code mới nhất nếu trong git repo
if [ -d .git ]; then
    echo -e "${YELLOW}[2/4] Kéo mã nguồn mới nhất từ Git...${NC}"
    git pull origin main || true
fi

# 4. Khởi động Docker Containers
echo -e "${YELLOW}[3/4] Build & Khởi động Docker stack (PostgreSQL, MinIO, Backend, Frontend)...${NC}"
docker compose down
docker compose up -d --build --force-recreate

# 5. Cấu hình Nginx Host và cấp SSL nếu có quyền root
echo -e "${YELLOW}[4/4] Kiểm tra cấu hình Nginx Reverse Proxy & SSL cho dhealth.home-care.vn...${NC}"
if [ "$EUID" -eq 0 ]; then
    bash setup-ssl.sh
else
    echo -e "${YELLOW}Để kích hoạt SSL cho domain dhealth.home-care.vn, vui lòng chạy:${NC}"
    echo -e "   sudo bash setup-ssl.sh"
fi

echo ""
echo -e "${GREEN}====================================================================${NC}"
echo -e "${GREEN}🎉 TRIỂN KHAI THÀNH CÔNG D-HEALTH!${NC}"
echo -e "${GREEN}   - Web Domain:       https://dhealth.home-care.vn${NC}"
echo -e "${GREEN}   - Local Frontend:   http://localhost:7001${NC}"
echo -e "${GREEN}   - Backend API:      http://localhost:7002/api/health${NC}"
echo -e "${GREEN}   - PostgreSQL:       localhost:7003 (db: dhealth_db)${NC}"
echo -e "${GREEN}   - MinIO S3 API:     http://localhost:7004${NC}"
echo -e "${GREEN}   - MinIO Console:    http://localhost:7005${NC}"
echo -e "${GREEN}====================================================================${NC}"
