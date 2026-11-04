import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SCR08_ImagingDetailScreen } from './SCR08_ImagingDetailScreen';

describe('SCR08_ImagingDetailScreen Mobile View TDD', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('render đầy đủ báo cáo CĐHA, các chuỗi xung DICOM và kết luận', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'rep_img_03',
          title: 'MRI gan có tiêm thuốc',
          category: 'MRI',
          facility_name: '[Bệnh viện đối tác]',
          ordering_doctor_name: '[Bác sĩ ung bướu]',
          interpreting_doctor_name: 'BS Lê Văn C',
          performed_at: '2026-08-20',
          body_part: 'Gan · ổ bụng trên',
          comparison_study_modality: 'CT',
          comparison_study_date: '2026-06-20',
          technique_description: 'MRI 1.5T ổ bụng trên, chuỗi T1, T2, DWI...',
          clinical_findings: 'Gan kích thước bình thường, bờ đều. Ba khối đặc ở hạ phân thuỳ VI, VII, VIII...',
          conclusion: 'Ba khối đặc gan giảm kích thước so với phim 20/06/2026 (tổng 45 → 38 mm)...',
          recommendations: 'Theo dõi đáp ứng điều trị, chụp lại sau 3 tháng.',
          series: [
            { id: 's1', series_name: 'T1 + thuốc' },
            { id: 's2', series_name: 'T2' },
            { id: 's3', series_name: 'DWI' },
          ],
        },
      }),
    });

    render(<SCR08_ImagingDetailScreen reportId="rep_img_03" onNavigate={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('MRI gan có tiêm thuốc')).toBeDefined();
    });

    expect(screen.getByText('T1 + thuốc')).toBeDefined();
    expect(screen.getByText('T2')).toBeDefined();
    expect(screen.getByText('DWI')).toBeDefined();
    expect(screen.getByText('KỸ THUẬT')).toBeDefined();
    expect(screen.getByText('MÔ TẢ')).toBeDefined();
    expect(screen.getByText('KẾT LUẬN')).toBeDefined();
    expect(screen.getByText('ĐỀ NGHỊ')).toBeDefined();
    expect(screen.getByText(/Xem ảnh DICOM/)).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút quay lại hoặc Theo dõi tổn thương', async () => {
    const handleNavigate = vi.fn();
    render(<SCR08_ImagingDetailScreen reportId="rep_img_03" onNavigate={handleNavigate} />);

    const backBtn = screen.getByLabelText('Quay lại');
    fireEvent.click(backBtn);
    expect(handleNavigate).toHaveBeenCalledWith('imaging');

    const trackBtn = screen.getByText('Theo dõi tổn thương');
    fireEvent.click(trackBtn);
    expect(handleNavigate).toHaveBeenCalledWith('imaging');
  });
});
