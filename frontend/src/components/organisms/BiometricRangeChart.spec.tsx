import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BiometricRangeChart } from './BiometricRangeChart';

describe('BiometricRangeChart Organism Component', () => {
  it('render đầy đủ giá trị chỉ số, đơn vị và phân loại trạng thái', () => {
    render(
      <BiometricRangeChart
        metricType="bp"
        title="Huyết áp"
        latestValue="131/82"
        unit="mmHg"
        recordedWhen="Hôm nay 07:15"
        statusTag="Tốt"
        statusBg="#DCFCE7"
        statusFg="#166534"
      />
    );

    expect(screen.getByText('Huyết áp')).toBeDefined();
    expect(screen.getByText(/131\/82/)).toBeDefined();
    expect(screen.getByText('mmHg')).toBeDefined();
    expect(screen.getByText('Tốt')).toBeDefined();
    expect(screen.getByText('Từ thiết bị')).toBeDefined();
  });
});
