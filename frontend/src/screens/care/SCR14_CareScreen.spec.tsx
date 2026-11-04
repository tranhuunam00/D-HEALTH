import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { SCR14_CareScreen } from './SCR14_CareScreen';

describe('SCR14_CareScreen Mobile View TDD', () => {
  const mockCareData = {
    upcomingAppointment: {
      id: 'app_1',
      month: 'TH 11',
      date: '12',
      title: 'Tái khám tim mạch',
      timeDoctor: '09:00 · BS Trần Văn B',
      facility: 'Bệnh viện Bạch Mai',
    },
    careTeam: [
      { id: 'hd', code: 'HD', name: 'Trần Minh Hương', role: 'Gia đình', color: 'mint', phone: '0987654321', email: 'huong@gmail.com' },
      { id: 'tb', code: 'TB', name: 'BS Trần Văn B', role: 'Tim mạch', color: 'pink', phone: '0912345678', email: 'bs.tranvanb@dhealth.vn' },
      { id: 'lc', code: 'LC', name: 'BS Lê Văn C', role: 'CĐHA', color: 'purple', phone: '0912345679', email: 'levanc@dhealth.vn' },
    ],
    sharingStats: {
      activeCount: 3,
      expiringSoonCount: 1,
      expiringDays: 7,
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(global, 'fetch').mockImplementation((url: any) => {
      if (typeof url === 'string' && url.includes('/api/care/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockCareData }),
        } as any);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) } as any);
    });
  });

  it('render 100% chuẩn thiết kế: Chăm sóc, Lịch hẹn 12 TH 11, My Care Team, BS Trần Văn B và Ai được xem dữ liệu', async () => {
    const handleNav = vi.fn();

    await act(async () => {
      render(<SCR14_CareScreen onNavigate={handleNav} />);
    });

    expect(screen.getByRole('heading', { name: 'Chăm sóc' })).toBeDefined();
    expect(screen.getByText('LỊCH HẸN SẮP TỚI')).toBeDefined();
    expect(screen.getByText('Tái khám tim mạch')).toBeDefined();
    expect(screen.getByText('12')).toBeDefined();
    expect(screen.getByText('TH 11')).toBeDefined();

    expect(screen.getByText('My Care Team')).toBeDefined();
    expect(screen.getByText('Gia đình')).toBeDefined();
    expect(screen.getByText('Tim mạch')).toBeDefined();
    expect(screen.getByText('CĐHA')).toBeDefined();
    expect(screen.getByText('Thêm bác sĩ')).toBeDefined();

    expect(screen.getByText('BS Trần Văn B')).toBeDefined();
    expect(screen.getByText('Gửi hồ sơ trước khám')).toBeDefined();
    expect(screen.getByText('Ai được xem dữ liệu của tôi?')).toBeDefined();
    expect(screen.getByText('Quản lý')).toBeDefined();
  });

  it('gọi navigate khi click thanh Bottom Navigation', async () => {
    const handleNav = vi.fn();

    await act(async () => {
      render(<SCR14_CareScreen onNavigate={handleNav} />);
    });

    fireEvent.click(screen.getByText('Trang chủ'));
    expect(handleNav).toHaveBeenCalledWith('home');
  });
});
