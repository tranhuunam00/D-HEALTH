import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CameraFloatingBottomBar } from './CameraFloatingBottomBar';

describe('CameraFloatingBottomBar Component', () => {
  it('renders correct button for manual mode', () => {
    const handleSave = vi.fn();
    render(
      <CameraFloatingBottomBar
        method="manual"
        isSaving={false}
        onSaveAndReturn={handleSave}
      />
    );

    expect(screen.getByText('Lưu vào hồ sơ')).toBeDefined();
    fireEvent.click(screen.getByText('Lưu vào hồ sơ'));
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it('renders correct buttons for camera mode', () => {
    const handleSave = vi.fn();
    render(
      <CameraFloatingBottomBar
        method="cam"
        isSaving={false}
        onSaveAndReturn={handleSave}
      />
    );

    expect(screen.getByText('Chụp lại')).toBeDefined();
    expect(screen.getByText('Có, thêm vào hồ sơ')).toBeDefined();
    fireEvent.click(screen.getByText('Có, thêm vào hồ sơ'));
    expect(handleSave).toHaveBeenCalledTimes(1);
  });
});
