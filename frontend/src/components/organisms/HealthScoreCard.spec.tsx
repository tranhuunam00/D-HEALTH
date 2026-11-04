import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { HealthScoreCard } from './HealthScoreCard';

describe('HealthScoreCard Organism Component', () => {
  it('hiển thị điểm tổng và trạng thái chuẩn y khoa', () => {
    render(
      <HealthScoreCard
        score={{
          total: 92,
          biometrics: 38,
          medications: 34,
          clinical: 20,
          status: 'Xuất sắc',
        }}
      />
    );

    expect(screen.getByText('92')).toBeDefined();
    expect(screen.getByText('Xuất sắc')).toBeDefined();
    expect(screen.getByText(/Sinh trắc học \(40%\)/i)).toBeDefined();
    expect(screen.getByText(/Tuân thủ thuốc \(35%\)/i)).toBeDefined();
  });
});
