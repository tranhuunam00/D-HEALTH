import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCareLogic } from './useCareLogic';

describe('useCareLogic Hook TDD', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('tải thông tin lịch hẹn, đội ngũ chăm sóc và thống kê chia sẻ quyền từ database', async () => {
    const mockData = {
      upcomingAppointment: {
        month: 'TH 11',
        date: '12',
        title: 'Tái khám tim mạch',
        timeDoctor: '09:00 · BS Trần Văn B',
        facility: '[Bệnh viện đối tác]',
      },
      careTeam: [
        { id: 'hd', code: 'HD', name: 'Trần Minh Hương', role: 'Gia đình', color: 'mint', phone: '0987654321', email: 'huong@gmail.com' },
        { id: 'tb', code: 'TB', name: 'BS Trần Văn B', role: 'Tim mạch', color: 'pink', phone: '[Số điện thoại]', email: '[email bác sĩ]' },
        { id: 'lc', code: 'LC', name: 'BS Lê Văn C', role: 'CĐHA', color: 'purple', phone: '0912345678', email: 'levanc@dhealth.vn' },
      ],
      sharingStats: {
        activeCount: 3,
        expiringSoonCount: 1,
        expiringDays: 7,
      },
    };

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockData }),
    } as any);

    const { result } = renderHook(() => useCareLogic('nam'));

    await act(async () => {
      await result.current.fetchCareSummary();
    });

    expect(result.current.upcomingAppointment?.month).toBe('TH 11');
    expect(result.current.upcomingAppointment?.date).toBe('12');
    expect(result.current.careTeam.length).toBe(3);
    expect(result.current.selectedMember?.name).toBe('BS Trần Văn B');
    expect(result.current.sharingStats.activeCount).toBe(3);
  });

  it('xử lý gửi hồ sơ trước khám và hiển thị thông báo thành công', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Đã gửi hồ sơ y tế thành công' }),
    } as any);

    const { result } = renderHook(() => useCareLogic('nam'));

    await act(async () => {
      await result.current.handleSendPreExamDossier();
    });

    expect(result.current.successMsg).toContain('Đã gửi hồ sơ');
  });
});
