import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR10_RecordsScreen } from './SCR10_RecordsScreen';

describe('SCR10_RecordsScreen Mobile View TDD', () => {
  it('render đầy đủ Hộ chiếu y tế, 6 ô phân hệ và dòng thời gian bệnh án', () => {
    render(<SCR10_RecordsScreen onNavigate={vi.fn()} />);

    expect(screen.getByText('Hồ sơ y tế')).toBeDefined();
    expect(screen.getByText(/Medical Passport/)).toBeDefined();
    expect(screen.getByText('Dị ứng')).toBeDefined();
    expect(screen.getByText('Bệnh lý')).toBeDefined();
    expect(screen.getByText('Thuốc')).toBeDefined();
    expect(screen.getByText('Xét nghiệm')).toBeDefined();
    expect(screen.getByText('CĐHA')).toBeDefined();
    expect(screen.getByText('Tài liệu')).toBeDefined();
    expect(screen.getByText(/Nhập kết quả vào hồ sơ/)).toBeDefined();
  });

  it('gọi onNavigate khi bấm vào ô Thuốc hoặc ô Xét nghiệm', () => {
    const handleNavigate = vi.fn();
    render(<SCR10_RecordsScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByText('Thuốc'));
    expect(handleNavigate).toHaveBeenCalledWith('meds');
  });
});
