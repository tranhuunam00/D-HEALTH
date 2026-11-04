import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { SCR16_UserProfileScreen } from './SCR16_UserProfileScreen';

describe('SCR16_UserProfileScreen Dark Mobile View TDD', () => {
  it('render 100% chuẩn giao diện: HỒ SƠ SỨC KHỎE CÁ NHÂN, CHỈ SỐ THỂ TRẠNG NỀN, nút Chỉnh Sửa Hồ Sơ, chuyển PC Admin và Nghị định 13', async () => {
    const handleBack = vi.fn();
    const handleAdmin = vi.fn();

    await act(async () => {
      render(
        <SCR16_UserProfileScreen
          onBack={handleBack}
          onNavigateToAdmin={handleAdmin}
          user={{
            id: 'nam',
            fullName: 'Trần Hữu Nam',
            phoneNumber: '0987654321',
            email: 'tranhuunam@gmail.com',
            bloodType: 'O+',
            heightCm: 172,
            weightKg: 68,
            role: 'patient',
          }}
        />
      );
    });

    expect(screen.getByText('HỒ SƠ SỨC KHỎE CÁ NHÂN')).toBeDefined();
    expect(screen.getByText('CHỦ TÀI KHOẢN (BỆNH NHÂN CHÍNH)')).toBeDefined();
    expect(screen.getByText('Trần Hữu Nam')).toBeDefined();
    expect(screen.getByText('0987654321')).toBeDefined();
    expect(screen.getByText('Chỉnh Sửa Hồ Sơ')).toBeDefined();

    expect(screen.getByText('CHỈ SỐ THỂ TRẠNG NỀN')).toBeDefined();
    expect(screen.getByText('Nhóm máu')).toBeDefined();
    expect(screen.getByText('O+')).toBeDefined();
    expect(screen.getByText('Hệ ABO / Rh')).toBeDefined();

    expect(screen.getByText('Chỉ số khối (BMI)')).toBeDefined();
    expect(screen.getByText('23.0')).toBeDefined();
    expect(screen.getByText('Thể trạng bình thường')).toBeDefined();

    expect(screen.getByText('Chiều cao')).toBeDefined();
    expect(screen.getByText('172')).toBeDefined();

    expect(screen.getByText('Cân nặng')).toBeDefined();
    expect(screen.getByText('68')).toBeDefined();

    expect(screen.getByText('Chuyển sang Quản Trị Hệ Thống (PC Admin)')).toBeDefined();
    expect(screen.getByText('Tuân Thủ Nghị Định 13/2023/NĐ-CP')).toBeDefined();

    // Thử tương tác click
    fireEvent.click(screen.getByText('Chuyển sang Quản Trị Hệ Thống (PC Admin)'));
    expect(handleAdmin).toHaveBeenCalled();
  });

  it('khi người dùng Google chưa nhập chiều cao cân nặng thì hiển thị Chưa rõ và --', async () => {
    await act(async () => {
      render(
        <SCR16_UserProfileScreen
          onBack={vi.fn()}
          user={{
            id: 'google_user',
            fullName: 'Bệnh Nhân Google',
            phoneNumber: undefined,
            email: 'google@gmail.com',
            bloodType: undefined,
            heightCm: undefined,
            weightKg: undefined,
            role: 'patient',
          }}
        />
      );
    });

    expect(screen.getByText('Bệnh Nhân Google')).toBeDefined();
    expect(screen.getByText('Chưa rõ')).toBeDefined();
    expect(screen.getAllByText('--').length).toBeGreaterThan(0);
  });
});
