import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { SCR06_LabDetailScreen } from './SCR06_LabDetailScreen';

describe('SCR06_LabDetailScreen Mobile View TDD', () => {
  const mockReport = {
    id: 'rep_nam_01',
    title: 'Sinh hoá máu',
    category: 'SH',
    facility_name: 'Bệnh viện Bạch Mai',
    ordering_doctor_name: 'BS Trần Văn B',
    performed_at: '2026-10-20',
    conclusion: 'Chỉ số Glucose và Cholesterol trong giới hạn an toàn',
  };

  const mockAnalytes = [
    { test_name: 'Glucose (đói)', value_numeric: 6.1, unit: 'mmol/L', reference_range: '3,9 – 6,4' },
    { test_name: 'LDL-C', value_numeric: 3.8, unit: 'mmol/L', reference_range: '< 2,6' },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(global, 'fetch').mockImplementation((url: any) => {
      if (typeof url === 'string' && url.includes('results/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, data: mockAnalytes }) } as any);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, data: [mockReport] }) } as any);
    });
  });

  it('render đầy đủ tiêu đề phiếu XN, bảng chỉ số và nút tác vụ', async () => {
    await act(async () => {
      render(<SCR06_LabDetailScreen onNavigate={vi.fn()} />);
    });

    expect(screen.getByText('Sinh hoá máu')).toBeDefined();
    expect(screen.getByText(/Bệnh viện Bạch Mai/)).toBeDefined();
    expect(screen.getByText('Glucose (đói)')).toBeDefined();
    expect(screen.getByText('6,1')).toBeDefined();
    expect(screen.getByText('LDL-C')).toBeDefined();
    expect(screen.getByText('Hỏi trợ lý AI')).toBeDefined();
    expect(screen.getByText('Gửi cho bác sĩ')).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút quay lại', async () => {
    const handleNavigate = vi.fn();
    await act(async () => {
      render(<SCR06_LabDetailScreen onNavigate={handleNavigate} />);
    });

    fireEvent.click(screen.getByLabelText('Quay lại'));
    expect(handleNavigate).toHaveBeenCalledWith('labs');
  });

  it('gọi onNavigate khi bấm nút Hỏi Trợ lý AI', async () => {
    const handleNavigate = vi.fn();
    await act(async () => {
      render(<SCR06_LabDetailScreen onNavigate={handleNavigate} />);
    });

    fireEvent.click(screen.getByText('Hỏi trợ lý AI'));
    expect(handleNavigate).toHaveBeenCalledWith('ai');
  });
});
