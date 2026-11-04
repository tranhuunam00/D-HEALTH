import React from 'react';
import { Phone, AlertCircle, UserCheck } from 'lucide-react';
import { Input } from '../../components/atoms/Input';
import { useLoginLogic } from './useLoginLogic';
import { User } from '../../types/auth.types';
import { DesignTokens } from '../../theme/tokens';

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
    fillQuickAccount,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
  } = useLoginLogic(onLoginSuccess);

  return (
    <div
      style={{
        background: DesignTokens.colors.gradientScreenBg,
        fontFamily: DesignTokens.typography.fontFamily,
      }}
      className="w-full min-h-screen relative box-border p-6 flex flex-col justify-between text-[#111827]"
    >
      {/* 1. Header & Brand Logo */}
      <div className="pt-4 flex flex-col items-center gap-2.5 text-center">
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: DesignTokens.radius.card,
            background: DesignTokens.colors.gradientBrand145,
            boxShadow: '0 12px 28px rgba(59, 102, 214, 0.35)',
          }}
          className="flex items-center justify-center"
        >
          <svg width="46" height="46" viewBox="0 0 48 48" role="img" aria-label="Logo D-Health">
            <path
              d="M24 40 L9.5 26 A8.5 8.5 0 0 1 21.5 14 L24 16.5 L26.5 14 A8.5 8.5 0 0 1 38.5 26 Z"
              fill={DesignTokens.colors.textWhite}
            />
            <path
              d="M12 25 H19 L21.5 20 L25 30 L27.5 25 H36"
              fill="none"
              stroke={DesignTokens.colors.brandTeal}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-2xl font-extrabold tracking-tight text-[#111827]">D-HEALTH</span>
          <span
            style={{ color: DesignTokens.colors.brandTealDark }}
            className="text-[11px] font-extrabold tracking-wider uppercase"
          >
            Trợ lý sức khoẻ thông minh
          </span>
        </div>
      </div>

      {/* 2. Main Login / Register Card */}
      <div
        style={{
          borderRadius: DesignTokens.radius.card,
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
        }}
        className="bg-white p-5 flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-base font-extrabold text-[#111827]">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </span>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ color: DesignTokens.colors.brandTeal }}
            className="text-xs font-bold hover:underline"
          >
            {mode === 'login' ? 'Đăng Ký Mới' : 'Đã có tài khoản?'}
          </button>
        </div>

        {/* Quick Account Chips (Tài khoản mẫu có sẵn trong CSDL PostgreSQL) */}
        {mode === 'login' && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#1F7A8C]" />
              Chọn tài khoản thực tế trong CSDL:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => fillQuickAccount('0987654321', 'Nam@2026')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  identifier === '0987654321'
                    ? 'bg-[#1F7A8C] text-white border-[#1F7A8C] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Trần Hữu Nam (0987654321)
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('0909123456', 'Khang@2026')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  identifier === '0909123456'
                    ? 'bg-[#1F7A8C] text-white border-[#1F7A8C] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Trần Minh Khang (0909123456)
              </button>
            </div>
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-2.5">
          {mode === 'register' && (
            <Input
              label="Họ và tên bệnh nhân"
              placeholder="Ví dụ: Trần Hữu Nam"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <Input
            label={mode === 'login' ? 'Số điện thoại hoặc Email' : 'Số điện thoại'}
            placeholder="0987654321"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <Input
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            isPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && (
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              height: DesignTokens.touch.standardButtonHeight,
              borderRadius: DesignTokens.radius.button,
              background: DesignTokens.colors.gradientBrand,
            }}
            className="w-full text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-[#1F7A8C]/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Đang xác thực...' : mode === 'login' ? 'Đăng Nhập An Toàn' : 'Đăng Ký Hồ Sơ Sức Khỏe'}
          </button>
        </form>

        {/* Google OAuth & Sinh trắc học */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              height: DesignTokens.touch.standardButtonHeight,
              borderRadius: DesignTokens.radius.buttonMedium,
              borderColor: DesignTokens.colors.borderSubtle,
            }}
            className="w-full border bg-white hover:bg-slate-50 text-[#111827] text-xs font-bold flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Tiếp tục với Google</span>
          </button>
        </div>
      </div>

      {/* 3. Footer Hotline & Copyright */}
      <div className="pb-3 flex flex-col items-center gap-1.5">
        <a
          href="tel:19001234"
          className="h-9 px-3.5 rounded-full bg-white/80 hover:bg-white text-[#111827] text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
        >
          <Phone style={{ color: DesignTokens.colors.brandTeal }} className="w-3.5 h-3.5" />
          <span>Hỗ trợ: 1900 1234</span>
        </a>
        <span className="text-[10px] font-semibold text-slate-500">
          Copyright © 2026 DAOGROUP · Nghị định 13/2023/NĐ-CP
        </span>
      </div>
    </div>
  );
};
