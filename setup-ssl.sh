#!/usr/bin/env bash
# ====================================================================
# D-HEALTH: Script tự động cấu hình Nginx Reverse Proxy & Cấp SSL Let's Encrypt
# Domain   : dhealth.home-care.vn
# Upstream : http://127.0.0.1:${TARGET_PORT} (Frontend Container)
# ====================================================================

set -e

DOMAIN="dhealth.home-care.vn"
EMAIL="${1:-}"

# Tự động đọc cổng FRONTEND_PORT từ file .env nếu có
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${CURRENT_DIR}/.env" ]; then
  ENV_PORT=$(grep -E '^FRONTEND_PORT=' "${CURRENT_DIR}/.env" | head -n 1 | cut -d '=' -f2 | tr -d ' "\r\n')
fi
TARGET_PORT="${ENV_PORT:-7101}"

# Màu sắc thông báo terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}====================================================================${NC}"
echo -e "${BLUE}   D-HEALTH: TỰ ĐỘNG CẤU HÌNH NGINX & CẤP PHÁT SSL CHO DOMAIN       ${NC}"
echo -e "${BLUE}   Tên miền : ${GREEN}${DOMAIN}${NC}"
echo -e "${BLUE}   Upstream : ${GREEN}127.0.0.1:${TARGET_PORT}${NC}"
echo -e "${BLUE}====================================================================${NC}"

# 1. Kiểm tra quyền root / sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[LỖI] Vui lòng chạy script này với quyền root hoặc sudo:${NC}"
  echo -e "      sudo bash setup-ssl.sh [email_nhan_canh_bao_ssl]"
  exit 1
fi

# 2. Xác định file cấu hình nguồn
CONF_NAME="${DOMAIN}.conf"
SOURCE_CONF="${CURRENT_DIR}/nginx/dhealth.home-care.vn.conf"

if [ ! -f "$SOURCE_CONF" ]; then
  echo -e "${RED}[LỖI] Không tìm thấy file mẫu: ${SOURCE_CONF}${NC}"
  exit 1
fi

# 3. Cài đặt Nginx và Certbot nếu máy chủ chưa có
install_dependencies() {
  echo -e "${YELLOW}[1/4] Kiểm tra các gói Nginx & Certbot...${NC}"
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -y
    if ! command -v nginx >/dev/null 2>&1; then
      echo -e "${YELLOW}Đang cài đặt Nginx...${NC}"
      apt-get install -y nginx
    fi
    if ! command -v certbot >/dev/null 2>&1; then
      echo -e "${YELLOW}Đang cài đặt Certbot & plugin Nginx...${NC}"
      apt-get install -y certbot python3-certbot-nginx
    fi
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y epel-release || true
    if ! command -v nginx >/dev/null 2>&1; then
      dnf install -y nginx
    fi
    if ! command -v certbot >/dev/null 2>&1; then
      dnf install -y certbot python3-certbot-nginx
    fi
  elif command -v yum >/dev/null 2>&1; then
    yum install -y epel-release || true
    if ! command -v nginx >/dev/null 2>&1; then
      yum install -y nginx
    fi
    if ! command -v certbot >/dev/null 2>&1; then
      yum install -y certbot python3-certbot-nginx
    fi
  fi
}

install_dependencies

# 4. Sao chép và kích hoạt Virtual Host Nginx
echo -e "${YELLOW}[2/4] Thiết lập cấu hình Nginx cho ${DOMAIN}...${NC}"

# Luôn tạo và gắn vào /etc/nginx/conf.d/ (mọi phiên bản Nginx: nginx.org, Ubuntu, CentOS đều nạp conf.d/*.conf)
mkdir -p /etc/nginx/conf.d
DEST_CONF="/etc/nginx/conf.d/${CONF_NAME}"
cp "$SOURCE_CONF" "$DEST_CONF"
sed -i "s|proxy_pass http://127.0.0.1:[0-9]*;|proxy_pass http://127.0.0.1:${TARGET_PORT};|g" "$DEST_CONF"

# Gỡ bỏ triệt để mọi trang mặc định "Welcome to nginx!" gây xung đột
echo -e "${YELLOW}Gỡ bỏ default site Nginx để chuyển hướng hoàn toàn vào D-HEALTH...${NC}"
rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true
rm -f /etc/nginx/conf.d/default.conf.bak 2>/dev/null || true
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
rm -f /etc/nginx/sites-enabled/*default* 2>/dev/null || true
rm -f /etc/nginx/sites-available/default 2>/dev/null || true

# Nếu hệ thống sử dụng kiến trúc sites-available / sites-enabled (Debian/Ubuntu), gắn thêm symlink
if [ -d "/etc/nginx/sites-available" ]; then
  mkdir -p /etc/nginx/sites-enabled
  cp "$SOURCE_CONF" "/etc/nginx/sites-available/${CONF_NAME}"
  sed -i "s|proxy_pass http://127.0.0.1:[0-9]*;|proxy_pass http://127.0.0.1:${TARGET_PORT};|g" "/etc/nginx/sites-available/${CONF_NAME}"
  ln -sf "/etc/nginx/sites-available/${CONF_NAME}" "/etc/nginx/sites-enabled/${CONF_NAME}"
fi

echo -e "${GREEN}✓ Đã gắn cấu hình reverse proxy tới 127.0.0.1:${TARGET_PORT} thành công!${NC}"

# 5. Kiểm tra cú pháp và khởi động lại Nginx
echo -e "${YELLOW}[3/4] Kiểm tra cú pháp Nginx (nginx -t)...${NC}"
nginx -t

systemctl enable nginx || true
systemctl restart nginx || service nginx restart

echo -e "${GREEN}✓ Nginx đã tải cấu hình reverse proxy tới 127.0.0.1:${TARGET_PORT} thành công!${NC}"

# 6. Cấp phát chứng chỉ SSL Let's Encrypt qua Certbot
echo -e "${YELLOW}[4/4] Bắt đầu xin cấp chứng chỉ SSL Let's Encrypt cho ${DOMAIN}...${NC}"

CERTBOT_ARGS="--nginx -d ${DOMAIN} --non-interactive --agree-tos --redirect"

if [ -n "$EMAIL" ]; then
  CERTBOT_ARGS="${CERTBOT_ARGS} -m ${EMAIL}"
else
  CERTBOT_ARGS="${CERTBOT_ARGS} --register-unsafely-without-email"
fi

# Chạy Certbot tự động cấu hình SSL
if certbot $CERTBOT_ARGS; then
  systemctl reload nginx || service nginx reload
  echo ""
  echo -e "${GREEN}====================================================================${NC}"
  echo -e "${GREEN}🎉 HOÀN TẤT THIẾT LẬP NGINX & SSL CHO D-HEALTH!${NC}"
  echo -e "${GREEN}   Website đang chạy bảo mật HTTPS tại: https://${DOMAIN}${NC}"
  echo -e "${GREEN}   Tự động gia hạn chứng chỉ SSL (Certbot Timer): Đã kích hoạt${NC}"
  echo -e "${GREEN}====================================================================${NC}"
else
  echo -e "${YELLOW}⚠️ Certbot gặp vấn đề trong việc xin cấp SSL Let's Encrypt (DNS hoặc Rate Limit).${NC}"
  echo -e "${GREEN}✓ Tuy nhiên hệ thống vẫn đang hoạt động bình thường qua HTTP tại: http://${DOMAIN}${NC}"
fi
