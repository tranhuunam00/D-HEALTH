import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SCR17_EmergencyScreen } from './SCR17_EmergencyScreen';

describe('SCR17_EmergencyScreen Mobile View TDD', () => {
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

  it('render đầy đủ Thẻ cấp cứu, nhóm máu O+, cảnh báo dị ứng và số điện thoại từ CSDL', async () => {
    render(<SCR17_EmergencyScreen onNavigate={vi.fn()} activeMemberName="Trần Hữu Nam" />);

    await waitFor(() => {
      expect(screen.getByText('Trần Hữu Nam')).toBeDefined();
    });

    expect(screen.getByText('EMERGENCY HEALTH CARD')).toBeDefined();
    expect(screen.getByText('O+')).toBeDefined();
    expect(screen.getByText(/Penicillin/)).toBeDefined();
    expect(screen.getByText(/0988 777 666/)).toBeDefined();
    expect(screen.getByText('Gọi Cấp Cứu 115')).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút đóng', async () => {
    const handleNavigate = vi.fn();
    render(<SCR17_EmergencyScreen onNavigate={handleNavigate} />);

    await waitFor(() => {
      expect(screen.getByText('EMERGENCY HEALTH CARD')).toBeDefined();
    });

    fireEvent.click(screen.getByLabelText('Đóng'));
    expect(handleNavigate).toHaveBeenCalledWith('home');
  });

  it('hiển thị trạng thái empty khi CSDL không có thẻ cấp cứu', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { card: null, contacts: [] } }),
    });

    render(<SCR17_EmergencyScreen onNavigate={vi.fn()} activeMemberId="unknown" />);

    await waitFor(() => {
      expect(screen.getByText(/Chưa có thông tin thẻ cấp cứu y tế trong cơ sở dữ liệu/)).toBeDefined();
    });
  });
});
