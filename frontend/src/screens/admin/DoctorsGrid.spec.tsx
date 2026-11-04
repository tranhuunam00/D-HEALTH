import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DoctorsGrid, DoctorItem } from './DoctorsGrid';

describe('DoctorsGrid Component TDD', () => {
  const sampleDoctors: DoctorItem[] = [
    {
      id: 'doc_1',
      full_name: 'GS.TS Nguyễn Văn Bình',
      academic_title: 'GS.TS',
      specialty: 'Tim mạch can thiệp',
      department_name: 'Khoa Tim Mạch',
      facility_name: 'Bệnh Viện Bạch Mai',
      license_no: 'CCHN-001294',
      is_active: true,
    },
    {
      id: 'doc_2',
      full_name: 'ThS.BS Lê Thị Hương',
      academic_title: 'ThS.BS',
      specialty: 'Nội tiết - Đái tháo đường',
      department_name: 'Khoa Nội Tiết',
      facility_name: 'Bệnh Viện Chợ Rẫy',
      license_no: 'CCHN-004812',
      is_active: false,
    },
  ];

  it('render danh sách bác sĩ với tên, học hàm, chuyên khoa và bệnh viện', () => {
    // Arrange & Act
    render(<DoctorsGrid doctors={sampleDoctors} />);

    // Assert
    expect(screen.getByText('GS.TS Nguyễn Văn Bình')).toBeDefined();
    expect(screen.getByText('Tim mạch can thiệp')).toBeDefined();
    expect(screen.getByText('Bệnh Viện Bạch Mai')).toBeDefined();
    expect(screen.getByText('CCHN-001294')).toBeDefined();
    expect(screen.getByText('ThS.BS Lê Thị Hương')).toBeDefined();
    expect(screen.getByText('Đang công tác')).toBeDefined();
    expect(screen.getByText('Nghỉ phép')).toBeDefined();
  });

  it('xử lý biên: hiển thị empty state khi danh sách rỗng', () => {
    // Arrange & Act
    render(<DoctorsGrid doctors={[]} />);

    // Assert
    expect(screen.getByText('Không có dữ liệu bác sĩ nào.')).toBeDefined();
  });
});
