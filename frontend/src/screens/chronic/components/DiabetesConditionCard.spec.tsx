import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DiabetesConditionCard } from './DiabetesConditionCard';

describe('DiabetesConditionCard Component TDD', () => {
  it('render thẻ Đái tháo đường với badge 1 cần khám và 6 chỉ số liên quan', () => {
    render(
      <DiabetesConditionCard
        condition={{
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
        }}
      />
    );

    expect(screen.getByText('Đái tháo đường')).toBeDefined();
    expect(screen.getByText('1 cần khám')).toBeDefined();
    expect(screen.getByText('HbA1c')).toBeDefined();
    expect(screen.getByText('Glucose')).toBeDefined();
    expect(screen.getByText('Cân nặng')).toBeDefined();
    expect(screen.getByText('Huyết áp')).toBeDefined();
    expect(screen.getByText('Thận')).toBeDefined();
    expect(screen.getByText('Mắt')).toBeDefined();
  });
});
