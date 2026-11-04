import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MedicationsGrid, MedicationItem } from './MedicationsGrid';

describe('MedicationsGrid Component TDD', () => {
  const sampleMeds: MedicationItem[] = [
    {
      id: 'med_1',
      brand_name: 'Amlor 5mg',
      generic_name: 'Amlodipine besylate',
      dosage_form: 'Viên nén',
      strength: '5mg',
      route: 'Uống',
      is_active: true,
    },
    {
      id: 'med_2',
      brand_name: 'Glucophage XR 500mg',
      generic_name: 'Metformin HCl',
      dosage_form: 'Viên phóng thích kéo dài',
      strength: '500mg',
      route: 'Uống',
      is_active: false,
    },
  ];

  it('render danh sách thuốc quốc gia với tên thương mại, hoạt chất, hàm lượng và đường dùng', () => {
    // Arrange & Act
    render(<MedicationsGrid medications={sampleMeds} />);

    // Assert
    expect(screen.getByText('Amlor 5mg')).toBeDefined();
    expect(screen.getByText('Amlodipine besylate')).toBeDefined();
    expect(screen.getByText('5mg')).toBeDefined();
    expect(screen.getByText('Glucophage XR 500mg')).toBeDefined();
    expect(screen.getByText('Khả dụng')).toBeDefined();
    expect(screen.getByText('Ngừng lưu hành')).toBeDefined();
  });

  it('xử lý biên: hiển thị empty state khi danh sách thuốc rỗng', () => {
    // Arrange & Act
    render(<MedicationsGrid medications={[]} />);

    // Assert
    expect(screen.getByText('Không có dữ liệu dược thư nào.')).toBeDefined();
  });
});
