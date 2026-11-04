import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CameraTypeAndMethodTabs } from './CameraTypeAndMethodTabs';

describe('CameraTypeAndMethodTabs Component', () => {
  it('renders kind and method options', () => {
    const handleSetKind = vi.fn();
    const handleSetMethod = vi.fn();

    render(
      <CameraTypeAndMethodTabs
        kind="lab"
        method="manual"
        onSetKind={handleSetKind}
        onSetMethod={handleSetMethod}
      />
    );

    expect(screen.getByText('Xét nghiệm')).toBeDefined();
    expect(screen.getByText('CĐHA')).toBeDefined();
    expect(screen.getByText('GPB')).toBeDefined();

    expect(screen.getByText('Nhập thủ công')).toBeDefined();
    expect(screen.getByText('Từ link CSYT')).toBeDefined();
    expect(screen.getByText('AI Camera')).toBeDefined();

    fireEvent.click(screen.getByText('CĐHA'));
    expect(handleSetKind).toHaveBeenCalledWith('img');

    fireEvent.click(screen.getByText('AI Camera'));
    expect(handleSetMethod).toHaveBeenCalledWith('cam');
  });
});
