import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MedAdherenceCard } from './MedAdherenceCard';

describe('MedAdherenceCard Component TDD', () => {
  it('render chuẩn tỷ lệ tuân thủ 91%, phân loại liều và số liều hôm nay 2/4', () => {
    render(
      <MedAdherenceCard
        adherencePercent={91}
        takenCount={109}
        missedCount={7}
        skippedCount={4}
        todayTaken={2}
        todayTotal={4}
      />
    );

    expect(screen.getByText('TUÂN THỦ 30 NGÀY')).toBeDefined();
    expect(screen.getByText('91%')).toBeDefined();
    expect(screen.getByText(/Đã uống 109 · Quên 7 · Bỏ 4 liều/)).toBeDefined();
    expect(screen.getByText('HÔM NAY')).toBeDefined();
    expect(screen.getByText('2/4 liều')).toBeDefined();
  });
});
