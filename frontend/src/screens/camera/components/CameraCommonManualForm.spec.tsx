import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CameraCommonManualForm } from './CameraCommonManualForm';

describe('CameraCommonManualForm Component', () => {
  it('renders form fields and handles input changes', () => {
    const setDate = vi.fn();
    const setDoctor = vi.fn();
    const setFacility = vi.fn();

    render(
      <CameraCommonManualForm
        testDate="2026-10-20"
        doctorName="BS Trần Văn B"
        facilityName="Bệnh viện Bạch Mai"
        onTestDateChange={setDate}
        onDoctorNameChange={setDoctor}
        onFacilityNameChange={setFacility}
      />
    );

    expect(screen.getByText('Ngày thực hiện *')).toBeDefined();
    expect(screen.getByText('Bác sĩ thực hiện')).toBeDefined();
    expect(screen.getByText('Cơ sở thực hiện')).toBeDefined();

    const doctorInput = screen.getByPlaceholderText('Họ tên bác sĩ');
    fireEvent.change(doctorInput, { target: { value: 'BS Lê Văn C' } });
    expect(setDoctor).toHaveBeenCalledWith('BS Lê Văn C');
  });
});
