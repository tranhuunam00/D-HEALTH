import { useState, useEffect } from 'react';
import { User, AuthResponse } from '../../types/auth.types';

export function useLoginLogic(onSuccess?: (user: User) => void) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fillQuickAccount = (phone: string, pass: string) => {
    setIdentifier(phone);
    setPassword(pass);
    setErrorMsg(null);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data: AuthResponse = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error?.message || 'Đăng nhập không thành công.');
        return;
      }
      if (data.data?.user && onSuccess) {
        if (data.data.token) {
          localStorage.setItem('dhealth_token', data.data.token);
        }
        localStorage.setItem('dhealth_user', JSON.stringify(data.data.user));
        onSuccess(data.data.user);
      }
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ y tế. Vui lòng kiểm tra mạng.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier || !password || !fullName) {
      setErrorMsg('Vui lòng điền đủ họ tên, số điện thoại và mật khẩu.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: identifier, email, password, fullName }),
      });
      const data: AuthResponse = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error?.message || 'Đăng ký không thành công.');
        return;
      }
      if (data.data?.user && onSuccess) {
        if (data.data.token) {
          localStorage.setItem('dhealth_token', data.data.token);
        }
        localStorage.setItem('dhealth_user', JSON.stringify(data.data.user));
        onSuccess(data.data.user);
      }
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ y tế. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const sendGoogleProfileToBackend = async (payload: { sub: string; email: string; name: string; picture?: string }) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data: AuthResponse = await res.json();
    if (!res.ok || !data.success) {
      setErrorMsg(data.error?.message || 'Đăng nhập Google thất bại.');
      return;
    }
    if (data.data?.user && onSuccess) {
      if (data.data.token) {
        localStorage.setItem('dhealth_token', data.data.token);
      }
      localStorage.setItem('dhealth_user', JSON.stringify(data.data.user));
      onSuccess(data.data.user);
    }
  };

  // 1. Tự động lắng nghe OAuth callback token từ URL hash khi Google hoàn tất chuyển hướng
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const accessToken = params.get('access_token');
      if (accessToken) {
        setLoading(true);
        // Xóa sạch token khỏi thanh địa chỉ để bảo mật
        window.history.replaceState(null, '', window.location.pathname);
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then(async (gProfile) => {
            const googleFullName = (
              gProfile.name ||
              [gProfile.given_name, gProfile.family_name].filter(Boolean).join(' ') ||
              (gProfile.email ? gProfile.email.split('@')[0].replace(/[._-]/g, ' ') : '')
            ).trim();
            await sendGoogleProfileToBackend({
              sub: gProfile.sub || `gg_${Date.now()}`,
              email: gProfile.email,
              name: googleFullName,
              picture: gProfile.picture,
            });
          })
          .catch(() => {
            setErrorMsg('Lỗi lấy thông tin hồ sơ từ Google.');
            setLoading(false);
          });
      }
    }
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const clientId =
        (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
        '506643667310-r9u7425ui324en7kh17sskspj5e55kte.apps.googleusercontent.com';

      // Chuyển sang chuẩn Google OAuth 2.0 Redirect Flow
      // Triệt tiêu hoàn toàn lỗi màn hình trắng accounts.google.com/gsi/transform trên Mobile WebView
      const origin =
        typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
          ? window.location.origin
          : 'https://localhost';

      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        clientId
      )}&redirect_uri=${encodeURIComponent(origin)}&response_type=token&scope=${encodeURIComponent(
        'email profile openid'
      )}&prompt=select_account`;

      window.location.href = oauthUrl;
    } catch {
      setErrorMsg('Lỗi kết nối xác thực Google.');
      setLoading(false);
    }
  };

  return {
    mode,
    setMode,
    identifier,
    setIdentifier,
    password,
    setPassword,
    fullName,
    setFullName,
    email,
    setEmail,
    loading,
    errorMsg,
    fillQuickAccount,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
  };
}
