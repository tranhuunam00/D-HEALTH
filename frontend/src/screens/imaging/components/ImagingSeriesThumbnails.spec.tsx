import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImagingSeriesThumbnails } from './ImagingSeriesThumbnails';

describe('ImagingSeriesThumbnails Component', () => {
  it('renders series items correctly', () => {
    const series = [
      { id: '1', name: 'T1 + thuốc' },
      { id: '2', name: 'T2' },
      { id: '3', name: 'DWI' },
    ];
    render(<ImagingSeriesThumbnails series={series} />);
    expect(screen.getByText('T1 + thuốc')).toBeDefined();
    expect(screen.getByText('T2')).toBeDefined();
    expect(screen.getByText('DWI')).toBeDefined();
  });

  it('renders empty list gracefully', () => {
    const { container } = render(<ImagingSeriesThumbnails series={[]} />);
    expect(container.firstChild).toBeDefined();
  });
});
