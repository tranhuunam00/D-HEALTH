import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LabTrackedMetricCard } from './LabTrackedMetricCard';

describe('LabTrackedMetricCard Component TDD', () => {
  const mockMetric = {
    id: 'ldl',
    label: 'LDL-Cholesterol',
    level: 'Mục tiêu < 2.6',
    levelType: 'warning' as const,
    value: '3.4',
    unit: 'mmol/L',
    insight: 'Có xu hướng tăng, cần điều chỉnh chế độ ăn giảm chất béo bão hòa.',
    points: [2.8, 3.1, 3.4],
  };

  it('render đầy đủ tên chỉ số, giá trị, đơn vị và phân tích nhận định y tế', () => {
    render(<LabTrackedMetricCard metric={mockMetric} />);

    expect(screen.getByText('LDL-Cholesterol')).toBeDefined();
    expect(screen.getByText('3.4')).toBeDefined();
    expect(screen.getByText('mmol/L')).toBeDefined();
    expect(screen.getByText('Mục tiêu < 2.6')).toBeDefined();
    expect(screen.getByText(/Có xu hướng tăng/)).toBeDefined();
  });
});

