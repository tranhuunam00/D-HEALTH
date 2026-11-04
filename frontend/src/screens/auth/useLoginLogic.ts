import { useState } from 'react';
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
        const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '10390227173-google-client-id.apps.googleusercontent.com',
          scope: 'email profile openid',
          callback: async (tokenResp: any) => {
            if (tokenResp.error) {
              setErrorMsg('Không thể đăng nhập tài khoản Google.');
              setLoading(false);
              return;
            }
            try {
              const uRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResp.access_token}` },
              });
              const gProfile = await uRes.json();
              await sendGoogleProfileToBackend({
                sub: gProfile.sub || `gg_${Date.now()}`,
                email: gProfile.email,
                name: gProfile.name,
                picture: gProfile.picture,
              });
            } catch {
              setErrorMsg('Lỗi lấy thông tin hồ sơ từ Google.');
              setLoading(false);
            }
          },
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      }

      const promptEmail = prompt('Nhập địa chỉ Email Google của bạn để đăng nhập:', email || 'tranhuunam@gmail.com');
      if (!promptEmail) {
        setLoading(false);
        return;
      }
      const promptName = prompt('Nhập Họ và Tên trên tài khoản Google:', fullName || 'Trần Hữu Nam') || 'Trần Hữu Nam';
      await sendGoogleProfileToBackend({
        sub: `gg_${Date.now()}`,
        email: promptEmail,
        name: promptName,
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(promptName)}`,
      });
    } catch {
      setErrorMsg('Lỗi kết nối xác thực Google.');
    } finally {
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
