import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BiometricEntrySheet } from './BiometricEntrySheet';

describe('BiometricEntrySheet Organism Component', () => {
  it('render đầy đủ các trường đo huyết áp, nhịp tim, SpO2, đường huyết', () => {
    render(<BiometricEntrySheet isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/Huyết áp tâm thu/i)).toBeDefined();
    expect(screen.getByLabelText(/Huyết áp tâm trương/i)).toBeDefined();
    expect(screen.getByLabelText(/Nhịp tim/i)).toBeDefined();
    expect(screen.getByLabelText(/Độ bão hòa oxy SpO2/i)).toBeDefined();
  });
});
