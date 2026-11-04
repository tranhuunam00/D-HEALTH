import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChronicLogic } from './useChronicLogic';

describe('useChronicLogic Hook TDD', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('tải danh sách bệnh mạn tính và việc cần làm từ API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          conditions: [
            {
              id: 'pcc_tim_mach',
              condition_name: 'Tim mạch',
              status_summary: 'Nguy cơ trung bình · xu hướng ổn định',
              next_checkup_date: '2026-11-12',
              target_metrics: [
                { name: 'Huyết áp', status: 'Theo dõi', type: 'warning' },
                { name: 'HbA1c', status: 'Tốt', type: 'good' },
              ],
            },
          ],
          tasks: [
            { id: 't1', title: 'Theo dõi huyết áp sáng và tối', is_completed: false },
          ],
        },
      }),
    });

    const { result } = renderHook(() => useChronicLogic('nam'));

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.conditions.length).toBe(1);
    expect(result.current.conditions[0].condition_name).toBe('Tim mạch');
    expect(result.current.tasks.length).toBe(1);
    expect(result.current.tasks[0].title).toBe('Theo dõi huyết áp sáng và tối');
  });

  it('hỗ trợ toggleTask và gửi PATCH cập nhật CSDL', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/tasks/')) {
        return Promise.resolve({ ok: true, json: async () => ({ success: true }) });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            conditions: [],
            tasks: [{ id: 't1', title: 'Đo huyết áp', is_completed: false }],
          },
        }),
      });
    });

    const { result } = renderHook(() => useChronicLogic('nam'));

    await act(async () => {
      await result.current.refetch();
    });

    await act(async () => {
      await result.current.toggleTask('t1');
    });

    expect(result.current.tasks[0].is_completed).toBe(true);
  });
});
