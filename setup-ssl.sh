#!/usr/bin/env bash
# ====================================================================
# D-HEALTH: Script tự động cấu hình Nginx Reverse Proxy & Cấp SSL Let's Encrypt
# Domain   : dhealth.home-care.vn
# Upstream : http://127.0.0.1:7001 (Frontend Container)
# ====================================================================

set -e

DOMAIN="dhealth.home-care.vn"
TARGET_PORT="7001"
EMAIL="${1:-}"

# Màu sắc thông báo terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================================${NC}"
echo -e "${BLUE}   D-HEALTH: TỰ ĐỘNG CẤU HÌNH NGINX & CẤP PHÁT SSL CHO DOMAIN       ${NC}"
echo -e "${BLUE}   Tên miền: ${GREEN}${DOMAIN}${BLUE} -> Target: ${GREEN}127.0.0.1:${TARGET_PORT}${NC}"
echo -e "${BLUE}====================================================================${NC}"

# 1. Kiểm tra quyền root / sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[LỖI] Vui lòng chạy script này với quyền root hoặc sudo:${NC}"
  echo -e "      sudo bash setup-ssl.sh [email_nhan_canh_bao_ssl]"
  exit 1
fi

# 2. Xác định file cấu hình nguồn
CONF_NAME="${DOMAIN}.conf"
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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

if [ -d "/etc/nginx/sites-available" ]; then
  # Dành cho Debian / Ubuntu
  cp "$SOURCE_CONF" "/etc/nginx/sites-available/${CONF_NAME}"
  mkdir -p /etc/nginx/sites-enabled
  ln -sf "/etc/nginx/sites-available/${CONF_NAME}" "/etc/nginx/sites-enabled/${CONF_NAME}"
  echo -e "${GREEN}✓ Đã gắn cấu hình vào /etc/nginx/sites-available/ và sites-enabled/${NC}"
elif [ -d "/etc/nginx/conf.d" ]; then
  # Dành cho CentOS / RHEL / Alpine / Nginx mặc định
  cp "$SOURCE_CONF" "/etc/nginx/conf.d/${CONF_NAME}"
  echo -e "${GREEN}✓ Đã gắn cấu hình vào /etc/nginx/conf.d/${NC}"
else
  mkdir -p /etc/nginx/conf.d
  cp "$SOURCE_CONF" "/etc/nginx/conf.d/${CONF_NAME}"
  echo -e "${GREEN}✓ Đã tạo thư mục và gắn cấu hình vào /etc/nginx/conf.d/${NC}"
fi

# 5. Kiểm tra cú pháp và khởi động lại Nginx
echo -e "${YELLOW}[3/4] Kiểm tra cú pháp Nginx (nginx -t)...${NC}"
nginx -t

systemctl enable nginx || true
systemctl restart nginx || service nginx restart

echo -e "${GREEN}✓ Nginx đã tải cấu hình mới thành công!${NC}"

# 6. Cấp phát chứng chỉ SSL Let's Encrypt qua Certbot
echo -e "${YELLOW}[4/4] Bắt đầu xin cấp chứng chỉ SSL Let's Encrypt cho ${DOMAIN}...${NC}"

CERTBOT_ARGS="--nginx -d ${DOMAIN} --non-interactive --agree-tos --redirect"

if [ -n "$EMAIL" ]; then
  CERTBOT_ARGS="${CERTBOT_ARGS} -m ${EMAIL}"
else
  CERTBOT_ARGS="${CERTBOT_ARGS} --register-unsafely-without-email"
fi

# Chạy Certbot tự động cấu hình SSL
certbot $CERTBOT_ARGS

# Nạp lại Nginx sau khi certbot đã gắn SSL
systemctl reload nginx || service nginx reload

echo ""
echo -e "${GREEN}====================================================================${NC}"
echo -e "${GREEN}🎉 HOÀN TẤT THIẾT LẬP NGINX & SSL CHO D-HEALTH!${NC}"
echo -e "${GREEN}   Website đang chạy an toàn tại: https://${DOMAIN}${NC}"
echo -e "${GREEN}   Tự động gia hạn chứng chỉ (Cron/Systemd Timer): Đã kích hoạt${NC}"
echo -e "${GREEN}====================================================================${NC}"
