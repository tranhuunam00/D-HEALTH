import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { SCR10_RecordsScreen } from './SCR10_RecordsScreen';

describe('SCR10_RecordsScreen Mobile View TDD', () => {
  it('render đầy đủ Hộ chiếu y tế, thẻ định danh thành viên và 9 phân hệ y tế từ DB', async () => {
    await act(async () => {
      render(<SCR10_RecordsScreen onNavigate={vi.fn()} />);
    });

    expect(screen.getByText('Hồ sơ y tế')).toBeDefined();
    expect(screen.getByText('Medical Passport')).toBeDefined();
    expect(screen.getByText(/26\/10\/2026/)).toBeDefined();
    expect(screen.getByText('Dị ứng')).toBeDefined();
    expect(screen.getByText('Bệnh đã mắc')).toBeDefined();
    expect(screen.getByText('Thuốc')).toBeDefined();
    expect(screen.getByText('Xét nghiệm')).toBeDefined();
    expect(screen.getByText('CĐHA')).toBeDefined();
    expect(screen.getByText('Giải phẫu bệnh')).toBeDefined();
    expect(screen.getByText('Tài liệu')).toBeDefined();
    expect(screen.getByText('Bác sĩ')).toBeDefined();
    expect(screen.getByText('Cơ sở y tế')).toBeDefined();
    expect(screen.getByText('+ Nhập kết quả')).toBeDefined();
  });

  it('gọi onNavigate khi bấm vào ô Thuốc, Xét nghiệm hoặc nút + Nhập kết quả', async () => {
    const handleNavigate = vi.fn();
    await act(async () => {
      render(<SCR10_RecordsScreen onNavigate={handleNavigate} />);
    });

    fireEvent.click(screen.getByText('Thuốc'));
    expect(handleNavigate).toHaveBeenCalledWith('meds');

    fireEvent.click(screen.getByText('Xét nghiệm'));
    expect(handleNavigate).toHaveBeenCalledWith('labs');

    fireEvent.click(screen.getByText('+ Nhập kết quả'));
    expect(handleNavigate).toHaveBeenCalledWith('camera-ocr');
  });
});
