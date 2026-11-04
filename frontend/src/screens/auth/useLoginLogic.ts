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
        onSuccess(data.data.user);
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối máy chủ y tế. Vui lòng thử lại.');
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
        onSuccess(data.data.user);
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối máy chủ y tế. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Giả lập nhận Google payload từ Google One Tap / OAuth SDK
      const googlePayload = {
        sub: `gg_${Date.now()}`,
        email: email || 'patient.google@dhealth.vn',
        name: fullName || 'Bệnh Nhân Google',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
      };

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googlePayload),
      });
      const data: AuthResponse = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error?.message || 'Đăng nhập Google thất bại.');
        return;
      }
      if (data.data?.user && onSuccess) {
        onSuccess(data.data.user);
      }
    } catch (err: any) {
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
    handleLogin,
    handleRegister,
    handleGoogleLogin,
  };
}
