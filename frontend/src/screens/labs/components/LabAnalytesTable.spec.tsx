import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LabAnalytesTable } from './LabAnalytesTable';

describe('LabAnalytesTable Component', () => {
  it('renders analyte rows properly', () => {
    const items = [
      { name: 'Glucose (đói)', value: '6,1', unit: 'mmol/L', refRange: '3,9 – 6,4' },
      { name: 'LDL-C', value: '3,8', unit: 'mmol/L', refRange: '< 2,6' },
    ];
    render(<LabAnalytesTable analytes={items} />);

    expect(screen.getByText('Chỉ số')).toBeDefined();
    expect(screen.getByText('Kết quả')).toBeDefined();
    expect(screen.getByText('Tham chiếu')).toBeDefined();

    expect(screen.getByText('Glucose (đói)')).toBeDefined();
    expect(screen.getByText('6,1')).toBeDefined();
    expect(screen.getByText('3,9 – 6,4')).toBeDefined();
  });
});

