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
      <label htmlFor={inputId} className="text-xs font-bold text-slate-700">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={inputId}
          type={actualType}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-slate-50 border ${error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-[#1F7A8C]'
            } text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 ${error ? 'focus:ring-rose-200' : 'focus:ring-[#1F7A8C]/20'
            } transition-all duration-200 ${className}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : null}
      </div>
      {error ? <span className="text-[11px] font-medium text-rose-600 mt-0.5">{error}</span> : null}
    </div>
  );
};
