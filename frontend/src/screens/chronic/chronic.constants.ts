/**
 * Hằng số cấu hình phân loại rủi ro và nhận diện bệnh mạn tính
 * Tuân thủ quy chuẩn Clean Code & No Magic Strings (GEMINI.md)
 */

export const CHRONIC_RISK_KEYWORDS = Object.freeze({
  high: Object.freeze(['nguy cơ cao', 'cần khám', 'nguy hiểm']),
  low: Object.freeze(['nguy cơ thấp', 'tốt', 'an toàn']),
});

export const CHRONIC_STATUS_KEYWORDS = Object.freeze({
  danger: Object.freeze(['khám']),
  warning: Object.freeze(['dõi']),
  good: Object.freeze(['tốt']),
});

export const CHRONIC_TYPE_KEYWORDS = Object.freeze({
  cardio: Object.freeze(['tim', 'huyết áp']),
  diabetes: Object.freeze(['đái', 'đường', 'tiểu']),
});
