import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR06_LabDetailScreen } from './SCR06_LabDetailScreen';

describe('SCR06_LabDetailScreen Mobile View TDD', () => {
  it('render đầy đủ tiêu đề phiếu XN, bảng chỉ số và nút tác vụ', () => {
    render(<SCR06_LabDetailScreen onNavigate={vi.fn()} />);

    expect(screen.getByText('Sinh hoá máu')).toBeDefined();
    expect(screen.getByText(/Bệnh viện Bạch Mai/)).toBeDefined();
    expect(screen.getByText('Glucose (đói)')).toBeDefined();
    expect(screen.getByText('6,1')).toBeDefined();
    expect(screen.getByText('LDL-C')).toBeDefined();
    expect(screen.getByText('Hỏi trợ lý AI')).toBeDefined();
    expect(screen.getByText('Gửi cho bác sĩ')).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút quay lại', () => {
    const handleNavigate = vi.fn();
    render(<SCR06_LabDetailScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByLabelText('Quay lại'));
    expect(handleNavigate).toHaveBeenCalledWith('labs');
  });

  it('gọi onNavigate khi bấm nút Hỏi Trợ lý AI', () => {
    const handleNavigate = vi.fn();
    render(<SCR06_LabDetailScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByText('Hỏi trợ lý AI'));
    expect(handleNavigate).toHaveBeenCalledWith('ai');
  });
});
