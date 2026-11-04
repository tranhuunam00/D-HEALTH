import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SCR09_ChronicScreen } from './SCR09_ChronicScreen';

describe('SCR09_ChronicScreen Mobile View TDD', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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
                { name: 'LDL-C', status: 'Theo dõi', type: 'warning' },
                { name: 'HbA1c', status: 'Tốt', type: 'good' },
                { name: 'Nhịp tim', status: 'Tốt', type: 'good' },
                { name: 'Cân nặng', status: 'Theo dõi', type: 'warning' },
              ],
            },
            {
              id: 'pcc_dai_thao_duong',
              condition_name: 'Đái tháo đường',
              status_summary: '1 cần khám',
              target_metrics: [
                { name: 'HbA1c', type: 'good' },
                { name: 'Glucose', type: 'warning' },
                { name: 'Cân nặng', type: 'warning' },
                { name: 'Huyết áp', type: 'good' },
                { name: 'Thận', type: 'good' },
                { name: 'Mắt', type: 'danger', icon: 'triangle' },
              ],
            },
          ],
          tasks: [
            { id: 't1', title: 'Theo dõi huyết áp sáng và tối', is_completed: false },
            { id: 't2', title: 'Xét nghiệm lipid máu trước tái khám', is_completed: false },
          ],
        },
      }),
    });
  });

  it('render đầy đủ thẻ Tim mạch đỏ sẫm, Việc cần làm tiếp theo và Đái tháo đường từ CSDL', async () => {
    render(<SCR09_ChronicScreen onNavigate={vi.fn()} activeMemberName="Trần Hữu Nam" />);

    expect(screen.getAllByText('Sức khoẻ').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Bệnh mạn tính')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('Tim mạch')).toBeDefined();
      expect(screen.getByText(/Nguy cơ trung bình/)).toBeDefined();
      expect(screen.getByText('Việc cần làm tiếp theo')).toBeDefined();
      expect(screen.getByText('Theo dõi huyết áp sáng và tối')).toBeDefined();
      expect(screen.getByText('Đái tháo đường')).toBeDefined();
      expect(screen.getByText('1 cần khám')).toBeDefined();
    });
  });

  it('gọi onNavigate khi bấm chuyển tab hoặc quay lại', () => {
    const handleNavigate = vi.fn();
    render(<SCR09_ChronicScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByText('Sinh trắc'));
    expect(handleNavigate).toHaveBeenCalledWith('biometrics');
  });
});
