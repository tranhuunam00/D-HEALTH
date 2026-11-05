import React from 'react';
import { Edit3 } from 'lucide-react';
import { InputMethod } from '../camera-input.types';

export interface CameraFloatingBottomBarProps {
  readonly method: InputMethod;
  readonly isSaving: boolean;
  readonly onSaveAndReturn: () => void;
  readonly onSwitchToManual?: () => void;
}

export const CameraFloatingBottomBar: React.FC<CameraFloatingBottomBarProps> = ({
  method,
  isSaving,
  onSaveAndReturn,
  onSwitchToManual,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-100 flex gap-2.5 z-30">
      {method === 'manual' ? (
        <button
          type="button"
          onClick={onSaveAndReturn}
          disabled={isSaving}
          className="w-full h-12 min-h-[44px] rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-extrabold flex items-center justify-center shadow-lg active:scale-95 transition"
        >
          {isSaving ? 'Đang lưu...' : 'Lưu vào hồ sơ'}
        </button>
      ) : (
        <button
          type="button"
          onClick={onSwitchToManual}
          className="w-full h-12 min-h-[44px] rounded-full bg-[#1F7A8C] hover:bg-[#165B69] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
        >
          <Edit3 className="w-4 h-4" />
          <span>Tính năng sắp ra mắt · Chuyển sang Nhập thủ công</span>
        </button>
      )}
    </div>
  );
};
