import React from 'react';
import { Link2, Building2, Clock, ArrowRight } from 'lucide-react';

interface LinkCSYTSectionProps {
  readonly linkUrl?: string;
  readonly onLinkUrlChange?: (val: string) => void;
  readonly linkUsername?: string;
  readonly onLinkUsernameChange?: (val: string) => void;
  readonly linkPassword?: string;
  readonly onLinkPasswordChange?: (val: string) => void;
  readonly captchaCode?: string;
  readonly onCaptchaCodeChange?: (val: string) => void;
  readonly onSwitchToManual?: () => void;
}

export const LinkCSYTSection: React.FC<LinkCSYTSectionProps> = ({ onSwitchToManual }) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 flex flex-col items-center text-center gap-3.5 my-1">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 shadow-2xs">
        <Link2 className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-[11px] font-black uppercase tracking-wider">
        <Clock className="w-3.5 h-3.5 text-sky-600" />
        <span>Tính năng sắp ra mắt</span>
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900">
          Đồng bộ kết quả từ Link Cơ Sở Y Tế
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[320px] mx-auto">
          Cổng kết nối liên thông dữ liệu tự động từ cổng thông tin bệnh viện / phòng khám theo chuẩn HL7 FHIR đang được triển khai thử nghiệm với các đối tác y tế.
        </p>
      </div>

      <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-start gap-2.5 text-left">
        <Building2 className="w-4 h-4 text-[#1F7A8C] shrink-0 mt-0.5" />
        <span className="text-[11px] text-slate-600 leading-snug">
          Hệ thống sẽ cập nhật ngay khi hoàn tất tích hợp API với các bệnh viện. Hiện tại, bạn có thể lưu trữ kết quả bằng phương thức <b>Nhập thủ công</b>.
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
