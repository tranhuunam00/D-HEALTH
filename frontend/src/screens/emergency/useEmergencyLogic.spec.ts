import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEmergencyLogic } from './useEmergencyLogic';

describe('useEmergencyLogic Hook TDD (Zero Mock Rule)', () => {
  const mockEmergencyResponse = {
    data: {
      card: {
        member_id: 'nam',
        blood_group_snapshot: 'O+',
        allergies: [{ allergen: 'Penicillin', reaction: 'Sốc phản vệ độ 2' }],
        chronic_conditions: ['Tăng huyết áp', 'Đái tháo đường Type 2'],
        emergency_notes: 'Bệnh nhân có tiền sử dị ứng Penicillin.',
        offline_qr_payload: 'DHEALTH:EMERGENCY:O+:ALLERGIES=Penicillin:CONTACT=0988777666',
      },
      contacts: [
        {
          contact_name: 'Trần Thu Hà',
          relationship: 'Vợ',
          phone_number: '0988 777 666',
          is_primary: true,
        },
      ],
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockEmergencyResponse,
    });
  });

  it('lấy thông tin thẻ cấp cứu, nhóm máu O+, dị ứng và liên hệ từ CSDL (/api/emergency/:memberId)', async () => {
    const { result } = renderHook(() => useEmergencyLogic('nam', 'Trần Hữu Nam'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.emergencyData).not.toBeNull();
    });

    expect(result.current.emergencyData?.bloodType).toBe('O+');
    expect(result.current.emergencyData?.allergies).toContain('Penicillin');
    expect(result.current.emergencyData?.emergencyContact.phone).toBe('0988 777 666');
    expect(result.current.emergencyData?.qrData).toContain('DHEALTH:EMERGENCY');
  });

  it('trả về null khi CSDL chưa có thẻ cấp cứu (không hiển thị mock rác)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { card: null, contacts: [] } }),
    });

    const { result } = renderHook(() => useEmergencyLogic('unknown_member'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.emergencyData).toBeNull();
    });
  });
});
