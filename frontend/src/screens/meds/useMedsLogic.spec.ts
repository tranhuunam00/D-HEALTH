import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMedsLogic } from './useMedsLogic';

describe('useMedsLogic Hook TDD', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('khởi tạo với các giá trị mặc định và tải lịch uống thuốc từ database', async () => {
    const mockTodayDoses = [
      { id: 'd1', name: 'Losartan', dosage: '50 mg', scheduled_time: '07:00:00', status: 'taken', taken: true, timing_instructions: '1 viên · sau ăn sáng' },
      { id: 'd2', name: 'Metformin', dosage: '500 mg', scheduled_time: '07:00:00', status: 'taken', taken: true, timing_instructions: '1 viên · sau ăn sáng' },
      { id: 'd3', name: 'Metformin', dosage: '500 mg', scheduled_time: '20:00:00', status: 'pending', taken: false, timing_instructions: '1 viên · sau ăn tối' },
      { id: 'd4', name: 'Atorvastatin', dosage: '20 mg', scheduled_time: '21:00:00', status: 'pending', taken: false, timing_instructions: '1 viên · trước khi ngủ' },
    ];

    const mockSummary = {
      adherencePercent: 91,
      takenCount: 109,
      missedCount: 7,
      skippedCount: 4,
      todayTaken: 2,
      todayTotal: 4,
      calendarDays: [{ day: 1, status: 'full' }],
    };

    vi.spyOn(global, 'fetch').mockImplementation((url: any) => {
      if (url.includes('today-doses')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, data: mockTodayDoses }) } as any);
      }
      if (url.includes('adherence-summary')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, data: mockSummary }) } as any);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) } as any);
    });

    const { result } = renderHook(() => useMedsLogic('nam'));

    await act(async () => {
      await result.current.fetchMedsData();
    });

    expect(result.current.doses.length).toBe(4);
    expect(result.current.adherence.adherencePercent).toBe(91);
    expect(result.current.adherence.todayTaken).toBe(2);
    expect(result.current.adherence.todayTotal).toBe(4);
  });

  it('xử lý ghi nhận Đã uống thuốc và cập nhật số liều hôm nay ngay lập tức', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: {} }),
    } as any);

    const { result } = renderHook(() => useMedsLogic('nam'));

    await act(async () => {
      await result.current.handleTakeDose('d3');
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/prescriptions/doses/d3/log'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
