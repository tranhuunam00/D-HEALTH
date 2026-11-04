import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CardioConditionCard } from './CardioConditionCard';

describe('CardioConditionCard Component TDD', () => {
  it('render thẻ Tim mạch màu đỏ sẫm với đầy đủ 6 chỉ số và ngày tái khám', () => {
    render(
      <CardioConditionCard
        condition={{
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
        }}
      />
    );

    expect(screen.getByText('Tim mạch')).toBeDefined();
    expect(screen.getByText(/Nguy cơ trung bình/)).toBeDefined();
    expect(screen.getByText('Huyết áp')).toBeDefined();
    expect(screen.getByText('LDL-C')).toBeDefined();
    expect(screen.getByText('HbA1c')).toBeDefined();
    expect(screen.getByText('Nhịp tim')).toBeDefined();
    expect(screen.getByText('Cân nặng')).toBeDefined();
    expect(screen.getByText('Tái khám')).toBeDefined();
    expect(screen.getByText('12/11/2026')).toBeDefined();
  });
});
