import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR08_ImagingDetailScreen } from './SCR08_ImagingDetailScreen';

describe('SCR08_ImagingDetailScreen Mobile View TDD', () => {
  it('render đầy đủ báo cáo CĐHA, các chuỗi xung DICOM và kết luận RECIST 1.1', () => {
    render(<SCR08_ImagingDetailScreen onNavigate={vi.fn()} />);

    expect(screen.getByText('MRI gan có tiêm thuốc đối quang từ')).toBeDefined();
    expect(screen.getByText(/Bệnh viện K Tân Triều/)).toBeDefined();
    expect(screen.getByText('T1 + Thuốc')).toBeDefined();
    expect(screen.getByText('T2')).toBeDefined();
    expect(screen.getByText('DWI')).toBeDefined();
    expect(screen.getAllByText(/RECIST 1.1/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Xem chuỗi lát cắt DICOM/)).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút quay lại', () => {
    const handleNavigate = vi.fn();
    render(<SCR08_ImagingDetailScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByLabelText('Quay lại'));
    expect(handleNavigate).toHaveBeenCalledWith('imaging');
  });

  it('gọi onNavigate khi bấm nút Hỏi Trợ lý AI', () => {
    const handleNavigate = vi.fn();
    render(<SCR08_ImagingDetailScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByText('Hỏi Trợ lý AI về ca chụp này'));
    expect(handleNavigate).toHaveBeenCalledWith('ai');
  });
});
