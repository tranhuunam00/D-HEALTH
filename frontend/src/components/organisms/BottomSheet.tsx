import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        data-testid="bottom-sheet-backdrop"
      />

      {/* Sheet Content: Rounded Top 28px, Max Height 88vh, Pure White Theme */}
      <div className="relative w-full max-w-[460px] max-h-[88vh] bg-white border-t border-slate-200 rounded-t-[28px] p-5 shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-200 text-slate-800">
        {/* Thanh kéo Thumb Handle 40x5px */}
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 pr-1 text-slate-800">{children}</div>
      </div>
    </div>
  );
};
