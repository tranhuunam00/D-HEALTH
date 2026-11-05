import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { SCR16_UserProfileScreen } from './SCR16_UserProfileScreen';

describe('SCR16_UserProfileScreen Light Mobile View TDD', () => {
  it('render 100% chuẩn giao diện: Thông tin người dùng, THÔNG TIN CÁ NHÂN, THÔNG TIN Y TẾ, camera đổi avatar và BMI tự động', async () => {
    const handleBack = vi.fn();
    const handleAdmin = vi.fn();
    const handleLogout = vi.fn();

    await act(async () => {
      render(
        <SCR16_UserProfileScreen
          onBack={handleBack}
          onNavigateToAdmin={handleAdmin}
          onLogout={handleLogout}
          user={{
            id: 'nam',
            fullName: 'Trần Hữu Nam',
            phoneNumber: '0901234567',
            email: 'nam.tran@dhealth.vn',
            bloodType: 'O+',
            heightCm: 174,
            weightKg: 72.5,
            role: 'patient',
          }}
        />
      );
    });

    // Tiêu đề & header pills
    expect(screen.getByText('Thông tin người dùng')).toBeDefined();
    expect(screen.getByText('Hôm nay: 26/10/2026')).toBeDefined();
    expect(screen.getByText(/Hồ sơ sức khoẻ:/)).toBeDefined();

    // Thẻ định danh
    expect(screen.getAllByText('Trần Hữu Nam').length).toBeGreaterThan(0);
    expect(screen.getByText('Đã xác thực định danh điện tử')).toBeDefined();
    expect(screen.getByLabelText('Đổi ảnh đại diện')).toBeDefined();

    // Thẻ THÔNG TIN CÁ NHÂN
    expect(screen.getByText('THÔNG TIN CÁ NHÂN')).toBeDefined();
    expect(screen.getByText('Số căn cước công dân')).toBeDefined();
    expect(screen.getByText('Ngày sinh')).toBeDefined();
    expect(screen.getByText('Giới tính')).toBeDefined();
    expect(screen.getByText('Số điện thoại')).toBeDefined();
    expect(screen.getByText('Email')).toBeDefined();
    expect(screen.getByText('Địa chỉ')).toBeDefined();

    // Thẻ THÔNG TIN Y TẾ
    expect(screen.getByText('THÔNG TIN Y TẾ')).toBeDefined();
    expect(screen.getByText('Nhóm máu')).toBeDefined();
    expect(screen.getByText('O+')).toBeDefined();
    expect(screen.getByText('Chiều cao')).toBeDefined();
    expect(screen.getByText('Cân nặng')).toBeDefined();

    // Live BMI
    expect(screen.getByText('Chỉ số khối (BMI):')).toBeDefined();
    expect(screen.getByText('23.9')).toBeDefined();

    // Switch admin & Decree 13
    expect(screen.queryByText('Chuyển sang Quản Trị Hệ Thống (PC Admin)')).toBeNull();
    expect(screen.getByText('Tuân Thủ Nghị Định 13/2023/NĐ-CP')).toBeDefined();
    expect(screen.getByText('Đăng xuất tài khoản')).toBeDefined();
  });

  it('chỉ hiển thị nút chuyển Quản Trị Hệ Thống khi người dùng có role admin', async () => {
    const handleAdmin = vi.fn();
    await act(async () => {
      render(
        <SCR16_UserProfileScreen
          onBack={vi.fn()}
          onNavigateToAdmin={handleAdmin}
          user={{
            id: 'admin_user',
            fullName: 'Quản Trị Viên',
            phoneNumber: 'admin',
            role: 'admin',
          }}
        />
      );
    });

    const adminBtn = screen.getByText('Chuyển sang Quản Trị Hệ Thống (PC Admin)');
    expect(adminBtn).toBeDefined();
    fireEvent.click(adminBtn);
    expect(handleAdmin).toHaveBeenCalled();
  });

  it('tự động tính BMI khi chiều cao và cân nặng thay đổi', async () => {
    await act(async () => {
      render(
        <SCR16_UserProfileScreen
          onBack={vi.fn()}
          user={{
            id: 'u2',
            fullName: 'Nguyễn Văn Test',
            bloodType: 'A+',
            heightCm: 170,
            weightKg: 65,
            role: 'patient',
          }}
        />
      );
    });

    expect(screen.getAllByText('Nguyễn Văn Test').length).toBeGreaterThan(0);
    expect(screen.getByText('22.5')).toBeDefined();
  });
});

