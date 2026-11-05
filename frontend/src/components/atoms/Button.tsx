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
    'min-h-[44px] px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white shadow-md shadow-[#1F7A8C]/20 hover:shadow-[#1F7A8C]/30 hover:brightness-105',
    secondary: 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200/80',
    outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};
