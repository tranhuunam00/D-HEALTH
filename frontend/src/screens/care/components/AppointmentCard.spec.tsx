import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AppointmentCard } from './AppointmentCard';

describe('AppointmentCard Component TDD', () => {
  it('render chuẩn ngày 12 TH 11, tiêu đề Tái khám tim mạch và bác sĩ', () => {
    render(
      <AppointmentCard
        month="TH 11"
        date="12"
        title="Tái khám tim mạch"
        timeDoctor="09:00 · BS Trần Văn B"
      />
    );

    expect(screen.getByText('TH 11')).toBeDefined();
    expect(screen.getByText('12')).toBeDefined();
    expect(screen.getByText('LỊCH HẸN SẮP TỚI')).toBeDefined();
    expect(screen.getByText('Tái khám tim mạch')).toBeDefined();
    expect(screen.getByText('09:00 · BS Trần Văn B')).toBeDefined();
  });
});
