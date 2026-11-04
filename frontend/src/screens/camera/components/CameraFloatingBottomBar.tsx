import React from 'react';
import { InputMethod } from '../camera-input.types';

export interface CameraFloatingBottomBarProps {
  method: InputMethod;
  isSaving: boolean;
  onSaveAndReturn: () => void;
}

export const CameraFloatingBottomBar: React.FC<CameraFloatingBottomBarProps> = ({
  method,
  isSaving,
  onSaveAndReturn,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-100 flex gap-2.5 z-30">
      {method === 'cam' && (
        <>
          <button
            type="button"
            onClick={() => alert('Chụp lại tài liệu')}
            className="w-28 h-12 min-h-[44px] rounded-full border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center active:scale-95 transition"
          >
            Chụp lại
          </button>
          <button
            type="button"
            onClick={onSaveAndReturn}
            className="flex-1 h-12 min-h-[44px] rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-extrabold flex items-center justify-center shadow-lg active:scale-95 transition"
          >
            Có, thêm vào hồ sơ
          </button>
        </>
      )}

      {method === 'manual' && (
        <button
          type="button"
          onClick={onSaveAndReturn}
          disabled={isSaving}
          className="w-full h-12 min-h-[44px] rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-extrabold flex items-center justify-center shadow-lg active:scale-95 transition"
        >
          {isSaving ? 'Đang lưu...' : 'Lưu vào hồ sơ'}
        </button>
      )}

      {method === 'link' && (
        <button
          type="button"
          onClick={onSaveAndReturn}
          className="w-full h-12 min-h-[44px] rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-extrabold flex items-center justify-center shadow-lg active:scale-95 transition"
        >
          Tải kết quả từ cơ sở y tế
        </button>
      )}
    </div>
  );
};
