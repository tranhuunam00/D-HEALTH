# D-HEALTH — Hộ Chiếu Y Tế & Theo Dõi Sức Khỏe Gia Đình Toàn Diện

[![Specification-Driven Development](https://img.shields.io/badge/Methodology-Spec--Kit-blue.svg)](https://github.com/github/spec-kit)
[![Domain-Driven Design](https://img.shields.io/badge/Architecture-DDD%20%2B%20Clean-emerald.svg)](GEMINI.md)
[![TDD Mandate](https://img.shields.io/badge/Testing-TDD%204D%20Mandate-orange.svg)](GEMINI.md)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED.svg)](docker-compose.yml)
[![Compliance](https://img.shields.io/badge/Security-Nghị%20định%2013%2F2023%2FNĐ--CP-red.svg)](GEMINI.md)

---

## 📌 Giới Thiệu Tổng Quan

**D-HEALTH** là nền tảng quản lý theo dõi sức khỏe chủ động cho gia đình và Hộ chiếu y tế điện tử đa chức năng (Digital Health Passport), kết nối trực tiếp thiết bị đo IoT qua Web Bluetooth (BLE), lưu trữ hồ sơ bệnh án, phim chụp DICOM/MRI/CT chuẩn y tế trên MinIO S3, và cảnh báo nguy cơ sức khỏe mạn tính theo thời gian thực.

Dự án được xây dựng tuân thủ 100% nguyên tắc kỹ thuật chuẩn doanh nghiệp:
- **Specification-Driven Development (SDD)**: Áp dụng GitHub Spec-Kit (`.specify/` & `specs/`).
- **Domain-Driven Design (DDD) & Clean Architecture**: Tách biệt rõ ràng tầng Domain, Use Cases, Presentation và Infrastructure.
- **TDD 4D Mandate**: 100% hàm có unit test bao phủ 4 chiều (Input biên, Output bất biến, Error ngoại lệ & Mã lỗi, Logic invariants).
- **Tuân thủ Nghị định 13/2023/NĐ-CP**: Mã hóa dữ liệu nhạy cảm PII, phân quyền đa tài khoản gia đình (Chủ tài khoản, Xem xét, Chăm sóc viên).

---

## 🏗️ Kiến Trúc Hệ Thống & Cấu Hình Cổng (Port Mapping)

Để đảm bảo vận hành song song mượt mà cùng các hệ thống khác trên máy chủ (như DSONO chạy dải cổng `6000`), D-HEALTH được cấu hình độc lập hoàn toàn trên dải cổng **`7000-series`**:

| Thành Phần | Dịch Vụ / Công Nghệ | Cổng Nội Bộ (Container) | Cổng Máy Chủ (Host Port) | Ghi Chú |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Web** | React 18/19, Vite, Tailwind CSS, Web BLE | `80` (Nginx) | `7001` | Giao diện Web PWA & Mobile Viewport |
| **Backend API** | Node.js, Express, TypeScript, Clean Arch | `7002` | `7002` | REST API `/api/v1` |
| **Database** | PostgreSQL 16 Alpine, UUID-OSSP, Seed | `5432` | `7003` | CSDL quan hệ chuẩn 13 bảng |
| **MinIO S3 API** | MinIO Object Storage Engine | `9000` | `7004` | S3 API lưu trữ tài liệu, ảnh, DICOM |
| **MinIO Console**| MinIO Web Management Console | `9001` | `7005` | Giao diện quản trị S3 Bucket |

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
D-HEALTH/
├── .github/workflows/          # CI/CD tự động triển khai (GitHub Actions SSH Deploy)
├── .specify/                   # SDD Spec-Kit: Hiến pháp kỹ thuật & Templates
│   ├── memory/constitution.md  # 6 Cổng kiểm soát bắt buộc (Constitution Gates)
│   └── templates/              # Biểu mẫu spec, plan, tasks, checklist
├── specs/                      # Đặc tả chức năng phân tầng
│   └── 001-dhealth-core-system/# Spec hệ thống cốt lõi
│       ├── spec.md             # Đặc tả User Stories P1, P2, P3 & Acceptance Criteria
│       ├── plan.md             # Kế hoạch kiến trúc Clean Architecture
│       ├── data-model.md       # DDL 13 bảng PostgreSQL & Value Objects bất biến
│       ├── tasks.md            # 67 tác vụ thực thi TDD
│       └── quickstart.md       # Kịch bản kiểm thử tích hợp nhanh
├── backend/                    # Mã nguồn Backend API (Express + TypeScript)
│   ├── src/                    # Kiến trúc phân tầng Controller - Service - Repo
│   ├── Dockerfile              # Multi-stage production build (Node 20 Alpine)
│   └── package.json
├── frontend/                   # Mã nguồn Frontend Web Client (React + Vite + TS)
│   ├── src/                    # Atomic Components (Atoms, Molecules, Organisms)
│   ├── nginx.conf              # Reverse proxy cho /api/ & /s3/, max-body 100M
│   ├── Dockerfile              # Multi-stage build (Node build -> Nginx Alpine)
│   └── package.json
├── docker/
│   └── init-db.sql             # Khởi tạo 13 bảng schema & dữ liệu mẫu bệnh nhân
├── nginx/
│   └── dhealth.home-care.vn.conf # Cấu hình Host Reverse Proxy cho domain chính
├── source/                     # Hồ sơ phân tích nghiệp vụ BA & Giao diện mẫu
├── docker-compose.yml          # Điều phối 5 containers (DB, MinIO, Backend, Frontend)
├── .env.example                # File mẫu biến môi trường (port 7000-series)
├── deploy.sh                   # Script one-click triển khai trên máy chủ Linux
├── setup-ssl.sh                # Script cài đặt chứng chỉ SSL Let's Encrypt tự động
├── start.sh                    # Script khởi chạy môi trường dev cục bộ
└── GEMINI.md                   # Bộ Quy Chuẩn Kỹ Thuật Dự Án (Engineering Rules)
```

---

## 🚀 Hướng Dẫn Cài Đặt & Vận Hành

### 1. Khởi chạy cục bộ (Local Development)

```bash
# 1. Sao chép biến môi trường
cp .env.example .env

# 2. Khởi động toàn bộ cụm dịch vụ qua Docker Compose
docker compose up -d --build

# 3. Kiểm tra trạng thái các containers
docker compose ps
```

Khi chạy thành công:
- **Frontend Web Simulator**: `http://localhost:7001`
- **Backend API Health Check**: `http://localhost:7002/api/health`
- **MinIO Console**: `http://localhost:7005` (Tài khoản: `admin_dhealth` / Mật khẩu: `DhealthMinio#2026@Secure`)
- **PostgreSQL**: `localhost:7003` (DB: `dhealth_db`, User: `dhealth_user`)

---

### 2. Triển khai trên máy chủ (Production Server)

Tên miền hệ thống: **`dhealth.home-care.vn`**

#### Bước 1: Cấu hình Host Nginx Reverse Proxy
```bash
sudo cp nginx/dhealth.home-care.vn.conf /etc/nginx/sites-available/dhealth.home-care.vn.conf
sudo ln -sf /etc/nginx/sites-available/dhealth.home-care.vn.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo system-ctl reload nginx
```

#### Bước 2: Kích hoạt SSL Tự Động (Let's Encrypt Certbot)
```bash
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh
```

#### Bước 3: Khởi chạy ứng dụng
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🔄 Tự Động Hóa Triển Khai (CI/CD Pipeline)

Quy trình GitHub Actions (`.github/workflows/deploy.yml`) tự động kích hoạt khi có commit đẩy lên nhánh `main`:
1. Kết nối an toàn qua SSH tới máy chủ (`dhealth.home-care.vn`).
2. Tự động `git pull origin main`.
3. Tái tạo và biên dịch lại các containers (`docker compose up -d --build`).
4. Kiểm tra sức khỏe API tự động (`/api/health`) trước khi hoàn tất bàn giao.

---

## 🛡️ Tiêu Chuẩn Kỹ Thuật Bắt Buộc (Engineering Standards)

- Mọi thành viên tham gia phát triển và AI coding agents **BẮT BUỘC** đọc kỹ [GEMINI.md](file:///d:/D-HEALTH/GEMINI.md) và [.specify/memory/constitution.md](file:///d:/D-HEALTH/.specify/memory/constitution.md) trước khi viết code.
- Kỹ năng AI Coding Agent chuẩn hóa được lưu trữ tập trung tại kho: [skill_agent_namth](https://github.com/tranhuunam00/skill_agent_namth).
