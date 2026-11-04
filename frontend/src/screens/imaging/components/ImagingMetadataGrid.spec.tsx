import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImagingMetadataGrid } from './ImagingMetadataGrid';

describe('ImagingMetadataGrid Component', () => {
  it('renders all metadata fields correctly', () => {
    render(
      <ImagingMetadataGrid
        performedAt="20/08/2026"
        bodyPart="Gan · ổ bụng trên"
        facilityName="Bệnh viện Đại học Y Dược"
        orderingDoctor="BS Nguyễn Văn A"
        interpretingDoctor="BS Lê Văn C"
        comparisonText="CT 20/06/2026"
      />
    );

    expect(screen.getByText('Ngày thực hiện')).toBeDefined();
    expect(screen.getByText('20/08/2026')).toBeDefined();
    expect(screen.getByText('Gan · ổ bụng trên')).toBeDefined();
    expect(screen.getByText('Bệnh viện Đại học Y Dược')).toBeDefined();
    expect(screen.getByText('BS Nguyễn Văn A')).toBeDefined();
    expect(screen.getByText('BS Lê Văn C')).toBeDefined();
    expect(screen.getByText('CT 20/06/2026')).toBeDefined();
  });
});
