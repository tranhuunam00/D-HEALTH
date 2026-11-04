import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR12_CameraInputScreen } from './SCR12_CameraInputScreen';

describe('SCR12_CameraInputScreen Mobile View TDD', () => {
  it('render đầy đủ 3 bước nhập kết quả cận lâm sàng theo chuẩn BA', () => {
    render(<SCR12_CameraInputScreen onNavigate={vi.fn()} />);

    expect(screen.getByText('Nhập kết quả cận lâm sàng')).toBeDefined();
    expect(screen.getByText('1. LOẠI KẾT QUẢ')).toBeDefined();
    expect(screen.getByText('Xét nghiệm')).toBeDefined();
    expect(screen.getByText('CĐHA')).toBeDefined();
    expect(screen.getByText('GPB')).toBeDefined();

    expect(screen.getByText('2. CÁCH NHẬP')).toBeDefined();
    expect(screen.getByText('Nhập thủ công')).toBeDefined();
    expect(screen.getByText('Từ link CSYT')).toBeDefined();
    expect(screen.getByText('AI Camera')).toBeDefined();

    expect(screen.getByText('3. NHẬP DỮ LIỆU')).toBeDefined();
    expect(screen.getByText(/Ngày thực hiện/)).toBeDefined();
    expect(screen.getByText('Chỉ số xét nghiệm')).toBeDefined();
    expect(screen.getByRole('button', { name: /Thêm chỉ số/i })).toBeDefined();
    expect(screen.getByText('Lưu vào hồ sơ')).toBeDefined();
  });

  it('chuyển đổi sang CĐHA hiển thị bộ phận và tổn thương dạng khối', () => {
    render(<SCR12_CameraInputScreen onNavigate={vi.fn()} />);

    fireEvent.click(screen.getByText('CĐHA'));
    expect(screen.getByText('Phương tiện')).toBeDefined();
    expect(screen.getByText('Bộ phận')).toBeDefined();
    expect(screen.getByText('Tổn thương dạng khối')).toBeDefined();
    expect(screen.getByRole('button', { name: /Thêm tổn thương/i })).toBeDefined();
  });

  it('chuyển đổi sang GPB hiển thị loại bệnh phẩm và hoá mô miễn dịch', () => {
    render(<SCR12_CameraInputScreen onNavigate={vi.fn()} />);

    fireEvent.click(screen.getByText('GPB'));
    expect(screen.getByText('Loại bệnh phẩm')).toBeDefined();
    expect(screen.getByText('Hoá mô miễn dịch')).toBeDefined();
    expect(screen.getByRole('button', { name: /Thêm dấu ấn/i })).toBeDefined();
  });

  it('chuyển sang Từ link CSYT hiển thị đường link, captcha và nút tải', () => {
    render(<SCR12_CameraInputScreen onNavigate={vi.fn()} />);

    fireEvent.click(screen.getByText('Từ link CSYT'));
    expect(screen.getByText('Đường link kết quả')).toBeDefined();
    expect(screen.getByText(/Mã xác thực/)).toBeDefined();
    expect(screen.getByText('Tải kết quả từ cơ sở y tế')).toBeDefined();
  });

  it('chuyển sang AI Camera hiển thị tài liệu đã trích xuất và nút xác nhận', () => {
    render(<SCR12_CameraInputScreen onNavigate={vi.fn()} />);

    fireEvent.click(screen.getByText('AI Camera'));
    expect(screen.getByText(/Phiếu xét nghiệm/)).toBeDefined();
    expect(screen.getByText('Có, thêm vào hồ sơ')).toBeDefined();
    expect(screen.getByText('Chụp lại')).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút quay lại', () => {
    const handleNavigate = vi.fn();
    render(<SCR12_CameraInputScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByLabelText('Quay lại'));
    expect(handleNavigate).toHaveBeenCalledWith('records');
  });
});
