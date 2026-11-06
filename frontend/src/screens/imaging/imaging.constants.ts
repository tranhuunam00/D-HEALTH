/**
 * Hằng số định danh phương tiện chẩn đoán hình ảnh (Modality Taxonomy)
 * Tuân thủ quy chuẩn Clean Code & No Magic Strings (GEMINI.md)
 */

export const MODALITY_TAXONOMY_KEYWORDS = Object.freeze({
  MRI: Object.freeze(['MRI', 'CỘNG HƯỞNG TỪ']),
  CT: Object.freeze(['CT', 'CẮT LỚP', 'SCAN']),
  SA: Object.freeze(['SA', 'SIÊU ÂM', 'US']),
  MM: Object.freeze(['MM', 'NHŨ ẢNH', 'MAMMO']),
  XQ: Object.freeze(['XQ', 'X-QUANG', 'XR', 'XRAY']),
});
