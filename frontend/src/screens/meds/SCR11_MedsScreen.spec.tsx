import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { SCR11_MedsScreen } from './SCR11_MedsScreen';

describe('SCR11_MedsScreen Mobile View TDD', () => {
  const mockTodayDoses = [
    { id: 'd1', name: 'Losartan', dosage: '50 mg', scheduled_time: '07:00:00', status: 'taken', taken: true, timing_instructions: '1 viên · sau ăn sáng' },
    { id: 'd2', name: 'Metformin', dosage: '500 mg', scheduled_time: '07:00:00', status: 'taken', taken: true, timing_instructions: '1 viên · sau ăn sáng' },
    { id: 'd3', name: 'Metformin', dosage: '500 mg', scheduled_time: '20:00:00', status: 'pending', taken: false, timing_instructions: '1 viên · sau ăn tối' },
    { id: 'd4', name: 'Atorvastatin', dosage: '20 mg', scheduled_time: '21:00:00', status: 'pending', taken: false, timing_instructions: '1 viên · trước khi ngủ' },
  ];

  const mockAdherence = {
    adherencePercent: 91,
    takenCount: 109,
    missedCount: 7,
    skippedCount: 4,
    todayTaken: 2,
    todayTotal: 4,
    calendarDays: [{ day: 1, status: 'full' }],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(global, 'fetch').mockImplementation((url: any) => {
      if (typeof url === 'string' && url.includes('today-doses')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, data: mockTodayDoses }) } as any);
      }
      if (typeof url === 'string' && url.includes('adherence-summary')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, data: mockAdherence }) } as any);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) } as any);
    });
  });

  it('render 100% chuẩn giao diện: Quản lý dùng thuốc, 3 Tabs, Banner tuân thủ 91%, Calendar và 4 cữ thuốc hôm nay', async () => {
    const handleNav = vi.fn();

    await act(async () => {
      render(<SCR11_MedsScreen onNavigate={handleNav} />);
    });

    expect(screen.getByText('Quản lý dùng thuốc')).toBeDefined();
    expect(screen.getByText('Lịch thuốc')).toBeDefined();
    expect(screen.getByText('Đang dùng')).toBeDefined();
    expect(screen.getByText('Tiền sử')).toBeDefined();

    expect(screen.getByText('TUÂN THỦ 30 NGÀY')).toBeDefined();
    expect(screen.getByText('91%')).toBeDefined();
    expect(screen.getByText('HÔM NAY')).toBeDefined();

    expect(screen.getByText('Tháng 10/2026')).toBeDefined();
    expect(screen.getByText('Hôm nay · 26/10')).toBeDefined();
    expect(screen.getByText('Losartan 50 mg')).toBeDefined();
    expect(screen.getByText('Atorvastatin 20 mg')).toBeDefined();

    expect(screen.getByText('Thêm thuốc')).toBeDefined();
    expect(screen.getByText('Nhập thủ công')).toBeDefined();
    expect(screen.getByText('AI Camera')).toBeDefined();
    expect(screen.getByText('Gửi tiền sử dùng thuốc cho bác sĩ')).toBeDefined();
  });

  it('gọi onNavigate khi bấm AI Camera hoặc nút Quay lại', async () => {
    const handleNav = vi.fn();

    await act(async () => {
      render(<SCR11_MedsScreen onNavigate={handleNav} />);
    });

    fireEvent.click(screen.getByText('AI Camera'));
    expect(handleNav).toHaveBeenCalledWith('camera-ocr');

    fireEvent.click(screen.getByRole('button', { name: /Quay lại/i }));
    expect(handleNav).toHaveBeenCalledWith('home');
  });
});
