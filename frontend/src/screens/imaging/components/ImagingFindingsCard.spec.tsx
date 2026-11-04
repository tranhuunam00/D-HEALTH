import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImagingFindingsCard } from './ImagingFindingsCard';

describe('ImagingFindingsCard Component', () => {
  it('renders technique and findings text', () => {
    render(
      <ImagingFindingsCard
        technique="MRI 1.5T chuỗi T1, T2"
        findings="Gan kích thước bình thường, không tổn thương"
      />
    );
    expect(screen.getByText('KỸ THUẬT')).toBeDefined();
    expect(screen.getByText('MRI 1.5T chuỗi T1, T2')).toBeDefined();
    expect(screen.getByText('MÔ TẢ')).toBeDefined();
    expect(screen.getByText('Gan kích thước bình thường, không tổn thương')).toBeDefined();
  });
});
