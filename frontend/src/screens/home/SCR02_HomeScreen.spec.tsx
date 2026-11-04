import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SCR02_HomeScreen } from './SCR02_HomeScreen';

describe('SCR02_HomeScreen Mobile View', () => {
  const mockDose = {
    id: '44444444-0000-0000-0000-000000000001',
    name: 'Metformin',
    dosage: '500 mg',
    scheduled_time: '20:00:00',
    instructions: '1 viên sau ăn tối',
    taken: false,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('members')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [{ id: 'nam', full_name: 'Trần Hữu Nam' }] }),
        });
      }
      if (url.includes('today-doses')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [mockDose] }),
        });
      }
      if (url.includes('biometrics')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            data: [
              { biometric_type: 'bp', systolic: 131, diastolic: 82, measured_at: new Date().toISOString() },
              { biometric_type: 'hr', value_numeric: 71, measured_at: new Date().toISOString() },
            ],
          }),
        });
      }
      if (url.includes('clinical-reports')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            data: [
              { id: 'rep_1', kind: 'lab', title: 'Xét nghiệm máu', performed_at: '2026-10-20' },
              { id: 'rep_2', kind: 'imaging', title: 'CT ngực', performed_at: '2026-10-08' },
            ],
          }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({ data: [] }) });
    });
  });

  it('render đầy đủ điểm sức khỏe, nút SOS cấp cứu, các nhóm dữ liệu và Health Timeline', async () => {
    render(<SCR02_HomeScreen onOpenEmergency={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Điểm sức khoẻ')).toBeDefined();
    });

    expect(screen.getByText('SOS')).toBeDefined();
    expect(screen.getByText('Huyết áp')).toBeDefined();
    expect(screen.getByText('Nhịp tim')).toBeDefined();
    expect(screen.getByText('1 vấn đề cần theo dõi')).toBeDefined();
    expect(screen.getByText('3 nhóm dữ liệu')).toBeDefined();
    expect(screen.getByText('Health Timeline')).toBeDefined();
    expect(screen.getByText('Xem phân tích')).toBeDefined();
    expect(screen.getByRole('button', { name: /Nhập số đo/i })).toBeDefined();
  });

  it('gọi onOpenEmergency khi người dùng nhấn nút SOS', async () => {
    const handleSOS = vi.fn();
    render(<SCR02_HomeScreen onOpenEmergency={handleSOS} />);

    await waitFor(() => {
      expect(screen.getByText('SOS')).toBeDefined();
    });

    fireEvent.click(screen.getByText('SOS'));
    expect(handleSOS).toHaveBeenCalled();
  });

  it('gọi onNavigate khi người dùng nhấn thẻ Huyết áp', async () => {
    const handleNav = vi.fn();
    render(<SCR02_HomeScreen onOpenEmergency={vi.fn()} onNavigate={handleNav} />);

    await waitFor(() => {
      expect(screen.getByText('Huyết áp')).toBeDefined();
    });

    fireEvent.click(screen.getByText('Huyết áp'));
    expect(handleNav).toHaveBeenCalledWith('biometrics');
  });

  it('xử lý click Đã uống thuốc và hiển thị trạng thái đã hoàn thành', async () => {
    render(<SCR02_HomeScreen onOpenEmergency={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Đã uống/i })).toBeDefined();
    });

    const doseBtn = screen.getByRole('button', { name: /Đã uống/i });
    fireEvent.click(doseBtn);
    expect(screen.getByText(/Đã uống/i)).toBeDefined();
  });
});
