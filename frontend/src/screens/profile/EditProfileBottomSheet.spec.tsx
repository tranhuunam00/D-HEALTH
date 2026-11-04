import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { EditProfileBottomSheet } from './EditProfileBottomSheet';
import { FamilyMember } from '../../types/member.types';

describe('EditProfileBottomSheet Component TDD', () => {
  const sampleMember: FamilyMember = {
    id: 'mem_1',
    user_id: 'usr_1',
    full_name: 'Trần Bệnh Nhân',
    relationship: 'owner',
    gender: 'Nam',
    birth_date: '1990-05-20',
    blood_type: 'O+',
    height_cm: 175,
    weight_kg: 70,
    is_above_18: true,
    consent_approved: true,
  };

  it('render đầy đủ các trường nhập liệu khi isOpen = true', () => {
    render(
      <EditProfileBottomSheet
        isOpen={true}
        member={sampleMember}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('Chỉnh Sửa Hồ Sơ Sức Khỏe')).toBeDefined();
    expect(screen.getByDisplayValue('Trần Bệnh Nhân')).toBeDefined();
    expect(screen.getByDisplayValue('175')).toBeDefined();
    expect(screen.getByDisplayValue('70')).toBeDefined();
    expect(screen.getByText('Chỉ số khối (BMI) tự động:')).toBeDefined();
    expect(screen.getByText('22.9')).toBeDefined();
  });

  it('không render nội dung khi isOpen = false', () => {
    const { container } = render(
      <EditProfileBottomSheet
        isOpen={false}
        member={sampleMember}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.queryByText('Chỉnh Sửa Hồ Sơ Sức Khỏe')).toBeNull();
  });

  it('gọi onSubmit với thông tin đã sửa (chiều cao, cân nặng số thực)', () => {
    const handleSubmit = vi.fn();
    render(
      <EditProfileBottomSheet
        isOpen={true}
        member={sampleMember}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.change(screen.getByDisplayValue('175'), { target: { value: '178' } });
    fireEvent.change(screen.getByDisplayValue('70'), { target: { value: '72' } });
    fireEvent.click(screen.getByRole('button', { name: /Lưu Hồ Sơ/ }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        height_cm: 178,
        weight_kg: 72,
      })
    );
  });
});
