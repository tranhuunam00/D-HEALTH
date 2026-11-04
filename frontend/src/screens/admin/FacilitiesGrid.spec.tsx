import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { FacilitiesGrid, FacilityItem } from './FacilitiesGrid';

describe('FacilitiesGrid Component TDD', () => {
  const sampleFacilities: FacilityItem[] = [
    {
      id: 'fac_1',
      code: 'BV-BM',
      name: 'Bệnh Viện Bạch Mai',
      facility_type: 'hospital_tw',
      city: 'Hà Nội',
      hotline: '1900-5757',
      is_active: true,
    },
    {
      id: 'fac_2',
      code: 'BV-CR',
      name: 'Bệnh Viện Chợ Rẫy',
      facility_type: 'hospital_tw',
      city: 'TP. Hồ Chí Minh',
      hotline: '028-3855-4137',
      is_active: false,
    },
  ];

  it('render đầy đủ danh sách cơ sở y tế với mã, tên, thành phố và trạng thái hoạt động', () => {
    // Arrange & Act
    render(<FacilitiesGrid facilities={sampleFacilities} />);

    // Assert
    expect(screen.getByText('Bệnh Viện Bạch Mai')).toBeDefined();
    expect(screen.getByText('BV-BM')).toBeDefined();
    expect(screen.getByText('Hà Nội')).toBeDefined();
    expect(screen.getByText('Bệnh Viện Chợ Rẫy')).toBeDefined();
    expect(screen.getByText('Hoạt động')).toBeDefined();
    expect(screen.getByText('Tạm dừng')).toBeDefined();
  });

  it('hiển thị thông báo empty khi danh sách rỗng (Boundary Case)', () => {
    // Arrange & Act
    render(<FacilitiesGrid facilities={[]} />);

    // Assert
    expect(screen.getByText('Không có dữ liệu cơ sở y tế nào.')).toBeDefined();
  });
});
