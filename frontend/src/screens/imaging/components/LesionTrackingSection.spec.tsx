import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { LesionTrackingSection } from './LesionTrackingSection';

describe('LesionTrackingSection Component TDD', () => {
  it('render đầy đủ tiêu đề, các dropdown bộ lọc và bảng đo kích thước', () => {
    render(
      <LesionTrackingSection
        enabled={true}
        onToggle={vi.fn()}
        trackingData={{
          targetTitle: 'Khối u đặc · Gan',
          subtitle: 'CT/MRI · 3 tổn thương',
          currentSumMm: 38,
          dates: ['15/03/26', '20/06/26', '20/08/26'],
          lesions: [
            { name: 'U1 · HPT VI', val1: 15, val2: 12, val3: 10 },
            { name: 'U2 · HPT VII', val1: 20, val2: 15, val3: 12 },
            { name: 'U3 · HPT VIII', val1: 25, val2: 18, val3: 16 },
          ],
          totalRow: [60, 45, 38],
          caption: 'Tổng đường kính giảm từ 60 mm xuống 38 mm sau điều trị.',
        }}
      />
    );

    expect(screen.getByText('Theo dõi kích thước tổn thương')).toBeDefined();
    expect(screen.getAllByText('Khối u đặc · Gan').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('38').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('U1 · HPT VI')).toBeDefined();
    expect(screen.getByText('Tổng đường kính')).toBeDefined();
  });

  it('gọi onToggle khi bấm vào công tắc switch', () => {
    const handleToggle = vi.fn();
    render(
      <LesionTrackingSection
        enabled={true}
        onToggle={handleToggle}
        trackingData={null}
      />
    );

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(handleToggle).toHaveBeenCalledWith(false);
  });
});
