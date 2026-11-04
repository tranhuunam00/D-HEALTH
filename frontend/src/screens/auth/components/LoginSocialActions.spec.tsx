import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginSocialActions } from './LoginSocialActions';

describe('LoginSocialActions Component', () => {
  it('renders Google and Biometrics buttons in login mode', () => {
    const handleGoogle = vi.fn();
    render(
      <LoginSocialActions
        mode="login"
        loading={false}
        onGoogleLogin={handleGoogle}
      />
    );

    expect(screen.getByText('Đăng nhập bằng sinh trắc học')).toBeDefined();
    expect(screen.getByText('Tiếp tục với Google')).toBeDefined();

    fireEvent.click(screen.getByText('Tiếp tục với Google'));
    expect(handleGoogle).toHaveBeenCalledTimes(1);
  });

  it('does not render biometrics button in register mode', () => {
    render(
      <LoginSocialActions
        mode="register"
        loading={false}
        onGoogleLogin={vi.fn()}
      />
    );

    expect(screen.queryByText('Đăng nhập bằng sinh trắc học')).toBeNull();
    expect(screen.getByText('Tiếp tục với Google')).toBeDefined();
  });
});

