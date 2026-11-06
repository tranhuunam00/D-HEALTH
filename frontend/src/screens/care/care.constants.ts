/**
 * Hằng số cấu hình phân loại màu sắc và danh mục chuyên khoa trong Đội ngũ Chăm sóc
 * Tuân thủ quy chuẩn Clean Code & No Magic Strings (GEMINI.md)
 */

export const SPECIALTY_COLOR_KEYWORDS = Object.freeze({
  pink: Object.freeze(['tim mạch', 'nội tiết']),
  purple: Object.freeze(['ung bướu', 'ngoại']),
  mint: Object.freeze(['cđha', 'xét nghiệm']),
});

export const CARE_DEFAULT_CONFIG = Object.freeze({
  defaultPhone: '1900 1115',
  defaultEmail: 'bacsi@dhealth.vn',
  defaultOrg: 'Bệnh viện đối tác',
  defaultRole: 'Khám chuyên khoa',
  defaultDoctorTitle: 'Bác sĩ',
  fallbackDoctorCode: 'BS',
  expiringDaysWarning: 7,
});

export const APPOINTMENT_TIME_SLOTS = Object.freeze([
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
]);

export const EMAIL_AT_SIGN = '@';
