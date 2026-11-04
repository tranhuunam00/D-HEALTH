import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DoctorProfileCard } from './DoctorProfileCard';
import type { CareTeamMember } from '../useCareLogic';

describe('DoctorProfileCard Component TDD', () => {
  const mockDoctor: CareTeamMember = {
    id: 'tb',
    code: 'TB',
    name: 'BS Trần Văn B',
    role: 'Tim mạch',
    org: '[Bệnh viện đối tác]',
    phone: '[Số điện thoại]',
    email: '[email bác sĩ]',
    color: 'pink',
  };

  it('render đầy đủ BS Trần Văn B, số điện thoại Gọi, email và nút Gửi hồ sơ trước khám', () => {
    const handleSend = vi.fn();
    const handleEdit = vi.fn();

    render(
      <DoctorProfileCard
        member={mockDoctor}
        onSendPreExamDossier={handleSend}
        onEdit={handleEdit}
      />
    );

    expect(screen.getByText('BS Trần Văn B')).toBeDefined();
    expect(screen.getByText(/Tim mạch · \[Bệnh viện đối tác\]/)).toBeDefined();
    expect(screen.getByText('[Số điện thoại]')).toBeDefined();
    expect(screen.getByText('Gọi')).toBeDefined();
    expect(screen.getByText('[email bác sĩ]')).toBeDefined();
    expect(screen.getByText('Email')).toBeDefined();
    expect(screen.getByText('Nhắn tin / Video')).toBeDefined();
    expect(screen.getByText('Gửi hồ sơ trước khám')).toBeDefined();

    fireEvent.click(screen.getByText('Gửi hồ sơ trước khám'));
    expect(handleSend).toHaveBeenCalled();
  });
});
