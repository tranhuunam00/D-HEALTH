import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { SCR05_LabsScreen } from './SCR05_LabsScreen';

describe('SCR05_LabsScreen Mobile View TDD', () => {
  const mockLabReports = [
    { id: 'rep_nam_01', title: 'Sinh hoá máu', category: 'SH', performed_at: '2026-10-20', facility_name: 'Bệnh viện Bạch Mai', conclusion: 'LDL-C hơi cao' },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockLabReports }),
    } as any);
  });

  it('render 100% chuẩn giao diện: Xét nghiệm, Chuyên khoa, Danh sách kết quả và Chỉ số theo dõi', async () => {
    await act(async () => {
      render(<SCR05_LabsScreen onNavigate={vi.fn()} />);
    });

    expect(screen.getByRole('heading', { name: 'Sức khoẻ' })).toBeDefined();
    expect(screen.getByRole('tab', { name: 'Xét nghiệm' })).toBeDefined();
    expect(screen.getByText('Tất cả')).toBeDefined();
    expect(screen.getByText('Sinh hoá máu')).toBeDefined();
    expect(screen.getByText('Chỉ số cần theo dõi')).toBeDefined();
  });

  it('gọi onNavigate khi bấm vào một dòng phiếu xét nghiệm để xem chi tiết', async () => {
    const handleNavigate = vi.fn();
    await act(async () => {
      render(<SCR05_LabsScreen onNavigate={handleNavigate} />);
    });

    fireEvent.click(screen.getByText('Sinh hoá máu'));
    expect(handleNavigate).toHaveBeenCalledWith('lab-detail', 'rep_nam_01');
  });
});
