/**
 * Hằng số cấu hình quản lý hồ sơ thành viên gia đình
 * Tuân thủ quy chuẩn Clean Code & No Magic Strings (GEMINI.md)
 */

export const FAMILY_ADMIN_FILTER_KEYWORDS = Object.freeze(['quản trị', 'admin']);

export const FAMILY_EXCLUDED_MEMBER_IDS = Object.freeze(['mem_admin']);

export const FAMILY_RELATIONSHIP_TEXT_MAP = Object.freeze({
  owner: 'Chủ tài khoản',
  spouse: 'Vợ / Chồng',
  child: 'Con',
  parent: 'Bố / Mẹ',
});
