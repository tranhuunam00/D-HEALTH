import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PassportTilesGrid } from './PassportTilesGrid';
import type { PassportCounts } from '../useRecordsLogic';

describe('PassportTilesGrid Component TDD', () => {
  const mockCounts: PassportCounts = {
    allergies: 1,
    chronic: 2,
    meds: 3,
    labs: 24,
    imaging: 7,
    pathology: 2,
    documents: 31,
    doctors: 6,
    facilities: 4,
  };

  it('hiển thị đầy đủ 9 ô dữ liệu với số lượng từ database', () => {
    const handleSelect = vi.fn();
    render(<PassportTilesGrid counts={mockCounts} onSelectTile={handleSelect} />);

    // Kiểm tra tên các danh mục
    expect(screen.getByText('Dị ứng')).toBeDefined();
    expect(screen.getByText('Bệnh đã mắc')).toBeDefined();
    expect(screen.getByText('Thuốc')).toBeDefined();
    expect(screen.getByText('Xét nghiệm')).toBeDefined();
    expect(screen.getByText('CĐHA')).toBeDefined();
    expect(screen.getByText('Giải phẫu bệnh')).toBeDefined();
    expect(screen.getByText('Tài liệu')).toBeDefined();
    expect(screen.getByText('Bác sĩ')).toBeDefined();
    expect(screen.getByText('Cơ sở y tế')).toBeDefined();

    // Kiểm tra số lượng tương ứng
    expect(screen.getByText('24')).toBeDefined();
    expect(screen.getByText('7')).toBeDefined();
    expect(screen.getByText('31')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
  });

  it('gọi onSelectTile với key tương ứng khi người dùng bấm vào ô', () => {
    const handleSelect = vi.fn();
    render(<PassportTilesGrid counts={mockCounts} onSelectTile={handleSelect} />);

    fireEvent.click(screen.getByText('Xét nghiệm'));
    expect(handleSelect).toHaveBeenCalledWith('labs');

    fireEvent.click(screen.getByText('Thuốc'));
    expect(handleSelect).toHaveBeenCalledWith('meds');
  });
});
