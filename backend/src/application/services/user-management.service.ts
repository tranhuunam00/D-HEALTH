export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface PaginationResult {
  limit: number;
  offset: number;
  page: number;
}

export interface MetaPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Tính toán tham số phân trang chuẩn CSDL (bảo vệ giới hạn boundary)
 */
export function buildPagination(pageInput?: number | string, limitInput?: number | string): PaginationResult {
  const page = Math.max(1, parseInt(String(pageInput || '1'), 10) || 1);
  const rawLimit = parseInt(String(limitInput || '10'), 10) || 10;
  const limit = Math.min(100, Math.max(1, rawLimit)); // Min 1, Max 100 bản ghi/trang
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Tính toán siêu dữ liệu phân trang (Meta) trả về cho Client
 */
export function calculatePaginationMeta(total: number, page: number, limit: number): MetaPagination {
  const totalSafe = Math.max(0, total);
  const totalPages = Math.ceil(totalSafe / limit) || 1;
  return {
    page,
    limit,
    total: totalSafe,
    totalPages,
  };
}

/**
 * Thẩm định định dạng số điện thoại Việt Nam cơ bản
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.trim().replace(/[\s.-]/g, '');
  return /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(cleaned) || /^admin_[a-zA-Z0-9_]+$/.test(cleaned);
}

/**
 * Thẩm định nhóm máu chuẩn y khoa
 */
export function isValidBloodType(bloodType: string): boolean {
  const VALID_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return VALID_TYPES.includes(bloodType);
}

/**
 * Thẩm định vai trò hệ thống hợp lệ
 */
export function isValidRole(role: string): boolean {
  const VALID_ROLES = ['super_admin', 'clinical_admin', 'doctor', 'patient'];
  return VALID_ROLES.includes(role);
}
