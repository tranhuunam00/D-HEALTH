import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEmergencyLogic } from './useEmergencyLogic';

describe('useEmergencyLogic Hook TDD', () => {
  it('khởi tạo với đầy đủ thông tin cấp cứu, nhóm máu O+, dị ứng và liên hệ khẩn cấp', () => {
    const { result } = renderHook(() => useEmergencyLogic());
    expect(result.current.emergencyData.bloodType).toBe('O+');
    expect(result.current.emergencyData.allergies).toContain('Penicillin');
    expect(result.current.emergencyData.emergencyContact.phone).toBeDefined();
    expect(result.current.emergencyData.qrData).toBeDefined();
  });
});
