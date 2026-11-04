import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SCR16_UserProfileScreen } from './SCR16_UserProfileScreen';

describe('SCR16_UserProfileScreen Mobile View', () => {
  it('render đầy đủ thông tin bệnh nhân, nhóm máu, BMI và nút Lưu hồ sơ', () => {
    render(<SCR16_UserProfileScreen onBack={vi.fn()} />);

    expect(screen.getByText('Hồ Sơ Sức Khỏe Cá Nhân')).toBeDefined();
    expect(screen.getByText('Chỉ Số Thể Trạng Nền')).toBeDefined();
    expect(screen.getByText('Nhóm máu')).toBeDefined();
    expect(screen.getByText(/Chỉ số khối \(BMI\)/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Lưu/i })).toBeDefined();
  });
});
