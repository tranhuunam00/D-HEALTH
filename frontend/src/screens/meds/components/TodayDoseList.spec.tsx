import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TodayDoseList } from './TodayDoseList';
import type { DoseItem } from '../useMedsLogic';

describe('TodayDoseList Component TDD', () => {
  const mockDoses: DoseItem[] = [
    {
      id: 'd1',
      time: '07:00',
      period: 'Sáng',
      name: 'Losartan 50 mg',
      instruction: '1 viên · sau ăn sáng',
      status: 'taken',
      taken: true,
    },
    {
      id: 'd2',
      time: '07:00',
      period: 'Sáng',
      name: 'Metformin 500 mg',
      instruction: '1 viên · sau ăn sáng',
      status: 'taken',
      taken: true,
    },
    {
      id: 'd3',
      time: '20:00',
      period: 'Tối',
      name: 'Metformin 500 mg',
      instruction: '1 viên · sau ăn tối',
      status: 'pending',
      taken: false,
    },
    {
      id: 'd4',
      time: '21:00',
      period: 'Tối',
      name: 'Atorvastatin 20 mg',
      instruction: '1 viên · trước khi ngủ',
      status: 'pending',
      taken: false,
    },
  ];

  it('render đầy đủ 4 cữ thuốc hôm nay với nhãn Đã uống và Sắp tới', () => {
    render(
      <TodayDoseList
        doses={mockDoses}
        onTakeDose={vi.fn()}
        onSkipDose={vi.fn()}
        onSnoozeDose={vi.fn()}
      />
    );

    expect(screen.getByText('Hôm nay · 26/10')).toBeDefined();
    expect(screen.getByText('Losartan 50 mg')).toBeDefined();
    expect(screen.getByText('Atorvastatin 20 mg')).toBeDefined();
    expect(screen.getAllByText('Đã uống').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sắp tới').length).toBe(2);
    expect(screen.getAllByText('Bỏ liều').length).toBe(2);
    expect(screen.getAllByText('Nhắc lại 15p').length).toBe(2);
  });

  it('gọi hàm onTakeDose khi người dùng bấm nút Đã uống của liều 20:00', () => {
    const handleTake = vi.fn();
    render(
      <TodayDoseList
        doses={mockDoses}
        onTakeDose={handleTake}
        onSkipDose={vi.fn()}
        onSnoozeDose={vi.fn()}
      />
    );

    const takeBtns = screen.getAllByRole('button', { name: 'Đã uống' });
    fireEvent.click(takeBtns[0]);
    expect(handleTake).toHaveBeenCalledWith('d3');
  });
});
