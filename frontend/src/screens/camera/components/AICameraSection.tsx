import React from 'react';
import { Camera, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { ClinicalDocKind } from '../camera-input.types';

interface AICameraSectionProps {
  readonly kind?: ClinicalDocKind;
  readonly onSwitchToManual?: () => void;
}

export const AICameraSection: React.FC<AICameraSectionProps> = ({ onSwitchToManual }) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex flex-col items-center text-center gap-3.5 my-1">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-2xs">
        <Camera className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 text-[11px] font-black uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Tính năng sắp ra mắt</span>
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900">
          Quét phiếu kết quả bằng AI Camera
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[320px] mx-auto">
          Mô hình AI OCR nhận diện tự động ảnh chụp phiếu xét nghiệm và phim cận lâm sàng đang trong giai đoạn huấn luyện và kiểm định chất lượng y khoa.
        </p>
      </div>

      <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-start gap-2.5 text-left">
        <ShieldCheck className="w-4 h-4 text-[#1F7A8C] shrink-0 mt-0.5" />
        <span className="text-[11px] text-slate-600 leading-snug">
          Để đảm bảo tính chính xác 100% của hồ sơ sức khỏe, vui lòng sử dụng phương thức <b>Nhập thủ công</b> trong thời gian này.
        </span>
      </div>

      {onSwitchToManual && (
        <button
          type="button"
          onClick={onSwitchToManual}
          className="w-full py-3 px-4 rounded-xl bg-[#1F7A8C] hover:bg-[#165B69] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
        >
          <span>Chuyển sang Nhập thủ công</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
