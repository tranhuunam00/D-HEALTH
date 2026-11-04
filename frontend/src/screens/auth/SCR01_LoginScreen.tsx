import React from 'react';
import { HeartPulse, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { useLoginLogic } from './useLoginLogic';
import { User } from '../../types/auth.types';

export interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const SCR01_LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const {
    mode,
    setMode,
    identifier,
    setIdentifier,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    errorMsg,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
  } = useLoginLogic(onLoginSuccess);

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-[700px] flex flex-col justify-between p-6 bg-[#0B132B] text-white">
      {/* 1. Header & Brand Logo */}
      <div className="pt-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] shadow-lg shadow-[#1F7A8C]/30 mb-4">
          <HeartPulse className="w-8 h-8 text-white animate-pulse" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">D-HEALTH</h1>
        <p className="text-xs text-slate-400 mt-1">Hệ sinh thái theo dõi sức khỏe gia đình chủ động</p>
      </div>

      {/* 2. Tab Chuyển đổi Đăng nhập / Đăng ký */}
      <div className="my-6 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 flex">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'login' ? 'bg-[#1F7A8C] text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Đăng Nhập
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'register' ? 'bg-[#1F7A8C] text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Đăng Ký Mới
        </button>
      </div>

      {/* 3. Form Input */}
      <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-3.5">
        {mode === 'register' && (
          <Input
            label="Họ và tên bệnh nhân"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

        <Input
          label={mode === 'login' ? 'Số điện thoại hoặc Email' : 'Số điện thoại đăng ký'}
          placeholder="0912345678"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <Input
          label="Mật khẩu"
          placeholder="Tối thiểu 8 ký tự"
          isPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Button type="submit" isLoading={loading} className="w-full mt-2">
          {mode === 'login' ? 'Đăng Nhập An Toàn' : 'Đăng Ký Hồ Sơ Sức Khỏe'}
        </Button>
      </form>

      {/* 4. Google OAuth Login Button */}
      <div className="my-6">
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-semibold uppercase">Hoặc</span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full min-h-[48px] bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-2xl border border-slate-700/80 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
        >
          {/* Official Google G Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Tiếp tục với Google</span>
        </button>
      </div>

      {/* 5. Footer & Compliance */}
      <div className="pb-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Bảo mật y tế theo Nghị định 13/2023/NĐ-CP</span>
      </div>
    </div>
  );
};
