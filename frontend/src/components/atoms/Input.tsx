import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-xs font-semibold text-slate-300">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={inputId}
          type={actualType}
          className={`w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-900/90 border ${
            error ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-700/80 focus:border-[#1F7A8C]'
          } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-rose-500' : 'focus:ring-[#1F7A8C]'
          } transition-all duration-200 ${className}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-200 p-1"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : null}
      </div>
      {error ? <span className="text-[11px] font-medium text-rose-400 mt-0.5">{error}</span> : null}
    </div>
  );
};
