import { describe, it, expect } from 'vitest';
import {
  buildPagination,
  calculatePaginationMeta,
  isValidPhoneNumber,
  isValidBloodType,
} from './user-management.service';

describe('UserManagementService Helper Functions', () => {
  describe('buildPagination', () => {
    // 1. HAPPY PATH & OUTPUT
    it('tính đúng offset và limit cho trang hợp lệ', () => {
      const res = buildPagination(2, 10);
      expect(res.page).toBe(2);
      expect(res.limit).toBe(10);
      expect(res.offset).toBe(10);
    });

    // 2. BOUNDARY & ERROR RESILIENCE
    it('bảo vệ giá trị biên: page âm hoặc 0 -> fallback về page 1', () => {
      const res1 = buildPagination(-5, 20);
      expect(res1.page).toBe(1);
      expect(res1.offset).toBe(0);

      const res2 = buildPagination(0, 20);
      expect(res2.page).toBe(1);
    });

    it('giới hạn limit tối đa không vượt quá 100 bản ghi', () => {
      const res = buildPagination(1, 500);
      expect(res.limit).toBe(100);
    });
  });

  describe('calculatePaginationMeta', () => {
    it('tính đúng số trang tổng cộng và làm tròn lên', () => {
      const meta = calculatePaginationMeta(25, 1, 10);
      expect(meta.total).toBe(25);
      expect(meta.totalPages).toBe(3);
    });

    it('trả về ít nhất 1 trang khi tổng bản ghi là 0', () => {
      const meta = calculatePaginationMeta(0, 1, 10);
      expect(meta.totalPages).toBe(1);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('chấp nhận số điện thoại di động Việt Nam hợp lệ', () => {
      expect(isValidPhoneNumber('0912345678')).toBe(true);
      expect(isValidPhoneNumber('+84987654321')).toBe(true);
      expect(isValidPhoneNumber('0388123456')).toBe(true);
    });

    it('từ chối số điện thoại thiếu chữ số hoặc ký tự lạ', () => {
      expect(isValidPhoneNumber('12345')).toBe(false);
      expect(isValidPhoneNumber('0912abc789')).toBe(false);
      expect(isValidPhoneNumber('')).toBe(false);
    });
  });

  describe('isValidBloodType', () => {
    it('chấp nhận các nhóm máu chuẩn A+, B+, O+, AB+', () => {
      expect(isValidBloodType('O+')).toBe(true);
      expect(isValidBloodType('AB-')).toBe(true);
    });

    it('từ chối nhóm máu không hợp lệ', () => {
      expect(isValidBloodType('C+')).toBe(false);
      expect(isValidBloodType('')).toBe(false);
    });
  });
});
