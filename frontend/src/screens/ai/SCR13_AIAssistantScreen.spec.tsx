import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR13_AIAssistantScreen } from './SCR13_AIAssistantScreen';

describe('SCR13_AIAssistantScreen Mobile View TDD', () => {
  it('render đầy đủ tiêu đề Trợ lý AI, hội thoại phân tích y tế và thanh chat', () => {
    render(<SCR13_AIAssistantScreen onNavigate={vi.fn()} />);

    expect(screen.getByText('Trợ lý sức khoẻ AI')).toBeDefined();
    expect(screen.getByText(/Hiểu hồ sơ của bạn/)).toBeDefined();
    expect(screen.getByText(/BV Bạch Mai/)).toBeDefined();
    expect(screen.getByText(/Nguồn: Phiếu xét nghiệm 20\/10/)).toBeDefined();
    expect(screen.getByPlaceholderText(/Hỏi bất kỳ điều gì về sức khoẻ/)).toBeDefined();
  });

  it('gọi onNavigate khi bấm vào chip nguồn dữ liệu dẫn sang phiếu xét nghiệm', () => {
    const handleNavigate = vi.fn();
    render(<SCR13_AIAssistantScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByText(/Nguồn: Phiếu xét nghiệm 20\/10/));
    expect(handleNavigate).toHaveBeenCalledWith('lab-detail', 'rep-01');
  });
});
