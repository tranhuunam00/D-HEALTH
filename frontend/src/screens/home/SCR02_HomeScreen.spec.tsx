import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SCR02_HomeScreen } from './SCR02_HomeScreen';

describe('SCR02_HomeScreen Mobile View', () => {
  it('render đầy đủ điểm sức khỏe, nút SOS cấp cứu và nút FAB nhập số đo', () => {
    render(<SCR02_HomeScreen onOpenEmergency={vi.fn()} />);

    expect(screen.getByText('Điểm sức khoẻ')).toBeDefined();
    expect(screen.getByText('SOS')).toBeDefined();
    expect(screen.getByText('Huyết áp')).toBeDefined();
    expect(screen.getByText('Nhịp tim')).toBeDefined();
    expect(screen.getByRole('button', { name: /Nhập số đo/i })).toBeDefined();
  });
});
