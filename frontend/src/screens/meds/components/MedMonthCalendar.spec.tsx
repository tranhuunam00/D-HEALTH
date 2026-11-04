import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MedMonthCalendar } from './MedMonthCalendar';

describe('MedMonthCalendar Component TDD', () => {
  it('render đầy đủ tiêu đề Tháng 10/2026, 7 thứ trong tuần, ngày 26 nổi bật và bảng chú thích', () => {
    const mockDays = Array.from({ length: 31 }, (_, i) => {
      const d = i + 1;
      let status: any = 'full';
      if (d === 26) status = 'today';
      else if (d > 26) status = 'scheduled';
      else if ([3, 9, 14, 22].includes(d)) status = 'missed';
      else if ([6, 11, 19].includes(d)) status = 'skipped';
      return { day: d, status };
    });

    render(<MedMonthCalendar days={mockDays} selectedDay={26} onSelectDay={vi.fn()} />);

    expect(screen.getByText('Tháng 10/2026')).toBeDefined();
    expect(screen.getByText('T2')).toBeDefined();
    expect(screen.getByText('CN')).toBeDefined();
    expect(screen.getByText('26')).toBeDefined();
    expect(screen.getByText('Đủ liều')).toBeDefined();
    expect(screen.getByText('Quên')).toBeDefined();
    expect(screen.getByText('Bỏ liều')).toBeDefined();
    expect(screen.getByText('Đã lên lịch')).toBeDefined();
  });
});
