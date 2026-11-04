import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PassportIdentityCard } from './PassportIdentityCard';

describe('PassportIdentityCard Component TDD', () => {
  it('render đầy đủ thông tin thành viên, thể trạng và nhóm máu', () => {
    const handleSwitch = vi.fn();
    render(
      <PassportIdentityCard
        member={{
          id: 'nam',
          fullName: 'Trần Minh Khang',
          isOwner: true,
          relationship: 'Chủ tài khoản',
          gender: 'Nam',
          age: 46,
          heightCm: 174,
          weightKg: 72.5,
          bmi: 23.9,
          bloodType: 'O+',
        }}
        onSwitchMember={handleSwitch}
      />
    );

    expect(screen.getByText('Trần Minh Khang')).toBeDefined();
    expect(screen.getByText('Chủ tài khoản')).toBeDefined();
    expect(screen.getByText(/46 tuổi · 174 cm · 72,5 kg · BMI 23.9/)).toBeDefined();
    expect(screen.getByText('Chạm để đổi hồ sơ thành viên')).toBeDefined();
    expect(screen.getByText('NHÓM MÁU')).toBeDefined();
    expect(screen.getByText('O+')).toBeDefined();

    fireEvent.click(screen.getByText('Chạm để đổi hồ sơ thành viên'));
    expect(handleSwitch).toHaveBeenCalled();
  });
});
