import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginHeader } from './LoginHeader';

describe('LoginHeader Component', () => {
  it('renders branding and title', () => {
    render(<LoginHeader />);
    expect(screen.getByText('D–HEALTH')).toBeDefined();
    expect(screen.getByText('TRỢ LÝ SỨC KHOẺ THÔNG MINH')).toBeDefined();
  });
});
