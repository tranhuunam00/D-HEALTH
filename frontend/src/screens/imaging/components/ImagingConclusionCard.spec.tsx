import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImagingConclusionCard } from './ImagingConclusionCard';

describe('ImagingConclusionCard Component', () => {
  it('renders conclusion and recommendation', () => {
    render(
      <ImagingConclusionCard
        conclusion="Tổn thương gan ổn định"
        recommendations="Tái khám sau 3 tháng"
      />
    );
    expect(screen.getByText('KẾT LUẬN')).toBeDefined();
    expect(screen.getByText('Tổn thương gan ổn định')).toBeDefined();
    expect(screen.getByText('ĐỀ NGHỊ')).toBeDefined();
    expect(screen.getByText('Tái khám sau 3 tháng')).toBeDefined();
  });
});
