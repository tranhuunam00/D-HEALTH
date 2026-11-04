import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LabMetadataCard } from './LabMetadataCard';

describe('LabMetadataCard Component', () => {
  it('renders all metadata entries correctly', () => {
    render(
      <LabMetadataCard
        facility="Bệnh viện Bạch Mai"
        doctor="BS Trần Văn B"
      />
    );

    expect(screen.getByText('Ngày lấy mẫu')).toBeDefined();
    expect(screen.getByText('Ngày trả kết quả')).toBeDefined();
    expect(screen.getByText('Bệnh viện Bạch Mai')).toBeDefined();
    expect(screen.getByText('BS Trần Văn B')).toBeDefined();
    expect(screen.getByText('Loại mẫu')).toBeDefined();
    expect(screen.getByText('Mã phiếu')).toBeDefined();
  });
});

