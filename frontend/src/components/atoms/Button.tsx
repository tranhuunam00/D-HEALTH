import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'min-h-[48px] px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white shadow-lg shadow-[#1F7A8C]/20 hover:shadow-[#1F7A8C]/30 hover:brightness-105',
    secondary: 'bg-slate-800 text-slate-200 border border-slate-700/80 hover:bg-slate-700/80',
    outline: 'bg-transparent text-slate-300 border border-slate-600/80 hover:bg-slate-800/40',
    danger: 'bg-rose-600/90 text-white hover:bg-rose-600 shadow-lg shadow-rose-900/20',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};
