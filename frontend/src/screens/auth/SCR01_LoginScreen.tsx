import React, { useState } from 'react';
import { Phone, AlertCircle, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useLoginLogic } from './useLoginLogic';
import { User as UserType } from '../../types/auth.types';
import { LoginHeader } from './components/LoginHeader';
import { LoginSocialActions } from './components/LoginSocialActions';

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
    handleLogin,
    handleRegister,
    handleGoogleLogin,
  } = useLoginLogic(onLoginSuccess);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#EBF6F8] via-[#F0F5FA] to-[#FAF8FC] text-slate-900 flex flex-col justify-between items-center p-6 font-sans select-none box-border">
      {/* 1. Header & App Branding */}
      <LoginHeader />

      {/* 2. White Card Container */}
      <div className="w-full max-w-[390px] bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-4 my-auto">
        <h2 className="text-xl font-extrabold text-slate-900">
          {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
        </h2>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-3.5">
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Họ và tên bệnh nhân</label>
              <div className="flex items-center gap-2.5 h-12 px-3.5 rounded-2xl border border-slate-200 bg-white focus-within:border-[#1F7A8C] focus-within:ring-2 focus-within:ring-[#1F7A8C]/20 transition">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Nhập họ và tên bệnh nhân..."
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

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 min-h-[44px] rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2563EB] text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-1"
          >
            {loading ? 'Đang xác thực...' : mode === 'login' ? 'Đăng nhập' : 'Đăng Ký Hồ Sơ'}
          </button>
        </form>

        {/* Social / Biometric Login Actions */}
        <LoginSocialActions
          mode={mode}
          loading={loading}
          onGoogleLogin={handleGoogleLogin}
        />

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

      {/* 3. Hotline Support Pill & Copyright */}
      <div className="pb-2 flex flex-col items-center gap-2">
        <a
          href="tel:19001234"
          className="h-11 min-h-[44px] px-4 rounded-full bg-white text-slate-700 text-xs font-bold flex items-center gap-2 shadow-xs border border-slate-100 hover:bg-slate-50 transition"
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
