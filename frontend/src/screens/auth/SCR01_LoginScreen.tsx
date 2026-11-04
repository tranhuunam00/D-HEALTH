import React, { useState } from 'react';
import { Phone, AlertCircle, User, Lock, Eye, EyeOff, ScanFace } from 'lucide-react';
import { useLoginLogic } from './useLoginLogic';
import { User as UserType } from '../../types/auth.types';

export interface LoginScreenProps {
  onLoginSuccess: (user: UserType) => void;
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
    fillQuickAccount,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
  } = useLoginLogic(onLoginSuccess);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#EBF6F8] via-[#F0F5FA] to-[#FAF8FC] text-slate-900 flex flex-col justify-between items-center p-6 font-sans select-none box-border">
      {/* 1. Header & App Branding (1:1 with Design) */}
      <div className="pt-6 flex flex-col items-center text-center">
        <div className="w-18 h-18 rounded-[26px] bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] flex items-center justify-center shadow-xl shadow-teal-700/20 mb-3">
          <svg width="42" height="42" viewBox="0 0 48 48" role="img" aria-label="Logo D-Health">
            <path
              d="M24 40 L9.5 26 A8.5 8.5 0 0 1 21.5 14 L24 16.5 L26.5 14 A8.5 8.5 0 0 1 38.5 26 Z"
              fill="#FFFFFF"
            />
            <path
              d="M12 25 H19 L21.5 20 L25 30 L27.5 25 H36"
              fill="none"
              stroke="#1F7A8C"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black tracking-wider text-slate-900 uppercase">D–HEALTH</h1>
        <span className="text-[11px] font-extrabold text-[#1F7A8C] tracking-widest uppercase mt-0.5">
          TRỢ LÝ SỨC KHOẺ THÔNG MINH
        </span>
      </div>

      {/* 2. White Card Container (1:1 with Design) */}
      <div className="w-full max-w-[390px] bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-4 my-auto">
        <h2 className="text-xl font-extrabold text-slate-900">
          {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
        </h2>

        {/* Quick select test account */}
        {mode === 'login' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => fillQuickAccount('0987654321', 'Nam@2026')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                identifier === '0987654321'
                  ? 'bg-teal-50 text-[#1F7A8C] border-teal-200 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Trần Hữu Nam (0987654321)
            </button>
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-3.5">
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Họ và tên bệnh nhân</label>
              <div className="flex items-center gap-2.5 h-12 px-3.5 rounded-2xl border border-slate-200 bg-white focus-within:border-[#1F7A8C] focus-within:ring-2 focus-within:ring-[#1F7A8C]/20 transition">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Ví dụ: Trần Hữu Nam"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />
              </div>
            </div>
          )}

          {/* Field: Tên đăng nhập */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Tên đăng nhập</label>
            <div className="flex items-center gap-2.5 h-12 px-3.5 rounded-2xl border border-slate-200 bg-white focus-within:border-[#1F7A8C] focus-within:ring-2 focus-within:ring-[#1F7A8C]/20 transition">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Số điện thoại hoặc email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Field: Mật khẩu */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
            <div className="flex items-center gap-2.5 h-12 px-3.5 rounded-2xl border border-slate-200 bg-white focus-within:border-[#1F7A8C] focus-within:ring-2 focus-within:ring-[#1F7A8C]/20 transition">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options: Ghi nhớ & Quên mật khẩu */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1F7A8C] border-slate-300 focus:ring-[#1F7A8C]"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Vui lòng liên hệ Hotline hỗ trợ để khôi phục mật khẩu.')}
                className="font-semibold text-[#1F7A8C] hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary Submit Button (Gradient Pill) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2563EB] text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-1"
          >
            {loading ? 'Đang xác thực...' : mode === 'login' ? 'Đăng nhập' : 'Đăng Ký Hồ Sơ'}
          </button>
        </form>

        {/* Biometrics Login Button (1:1 with Design) */}
        {mode === 'login' && (
          <button
            type="button"
            onClick={() => fillQuickAccount('0987654321', 'Nam@2026')}
            className="w-full h-12 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all"
          >
            <ScanFace className="w-4 h-4 text-slate-700" />
            <span>Đăng nhập bằng sinh trắc học</span>
          </button>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-11 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] transition-all"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Tiếp tục với Google</span>
        </button>

        {/* Card Footer Link */}
        <div className="text-center text-xs text-slate-500 pt-1">
          <span>{mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}</span>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[#1F7A8C] font-bold hover:underline"
          >
            {mode === 'login' ? 'Đăng ký' : 'Đăng nhập ngay'}
          </button>
        </div>
      </div>

      {/* 3. Hotline Support Pill & Copyright (1:1 with Design) */}
      <div className="pb-2 flex flex-col items-center gap-2">
        <a
          href="tel:19001234"
          className="h-9 px-4 rounded-full bg-white text-slate-700 text-xs font-bold flex items-center gap-2 shadow-xs border border-slate-100 hover:bg-slate-50 transition"
        >
          <Phone className="w-3.5 h-3.5 text-[#1F7A8C]" />
          <span>Hỗ trợ: [Số điện thoại hỗ trợ]</span>
        </a>
        <span className="text-xs font-semibold text-slate-400">
          Copyright © 2026 DAOGROUP
        </span>
      </div>
    </div>
  );
};
