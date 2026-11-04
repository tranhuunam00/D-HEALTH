import React from 'react';
import { QrCode, RefreshCw } from 'lucide-react';

interface LinkCSYTSectionProps {
  linkUrl: string;
  onLinkUrlChange: (val: string) => void;
  linkUsername: string;
  onLinkUsernameChange: (val: string) => void;
  linkPassword: string;
  onLinkPasswordChange: (val: string) => void;
  captchaCode: string;
  onCaptchaCodeChange: (val: string) => void;
}

export const LinkCSYTSection: React.FC<LinkCSYTSectionProps> = ({
  linkUrl,
  onLinkUrlChange,
  linkUsername,
  onLinkUsernameChange,
  linkPassword,
  onLinkPasswordChange,
  captchaCode,
  onCaptchaCodeChange,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Banner hướng dẫn */}
      <div className="bg-gradient-to-r from-[#DDF4EE] to-[#E3EBFF] rounded-2xl p-3.5 text-xs text-[#134E4A] font-medium leading-relaxed border border-teal-200/60 shadow-xs">
        Nhập link và thông tin đăng nhập mà cơ sở y tế gửi cho bạn (SMS, email hoặc in trên phiếu hẹn). D-Health tải kết quả, AI đọc và chuẩn hoá, bạn xác nhận trước khi lưu.
      </div>

      <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col gap-3">
        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Đường link kết quả</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => onLinkUrlChange(e.target.value)}
              placeholder="https://ketqua.benhvien.vn/..."
              className="flex-1 h-11 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Quét mã QR trên phiếu"
              onClick={() => alert('Mở camera quét mã QR trên phiếu hẹn')}
              className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 active:scale-95 transition"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Tên đăng nhập</label>
          <input
            value={linkUsername}
            onChange={(e) => onLinkUsernameChange(e.target.value)}
            placeholder="Mã bệnh nhân / mã tra cứu"
            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Mật khẩu</label>
          <input
            type="password"
            value={linkPassword}
            onChange={(e) => onLinkPasswordChange(e.target.value)}
            placeholder="Mật khẩu tra cứu"
            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Mã xác thực (captcha)</label>
          <div className="flex items-center gap-2">
            <div
              role="img"
              aria-label="Ảnh mã xác thực của cơ sở y tế"
              className="w-28 h-11 rounded-xl border-1.5 border-dashed border-slate-300 bg-slate-100 flex items-center justify-center text-xs font-black tracking-widest text-slate-700 select-none shrink-0"
            >
              7X9K2
            </div>
            <button
              type="button"
              aria-label="Tải mã khác"
              onClick={() => alert('Đã làm mới captcha')}
              className="w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center shrink-0 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <input
              placeholder="Nhập mã"
              value={captchaCode}
              onChange={(e) => onCaptchaCodeChange(e.target.value)}
              className="flex-1 h-11 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <span className="text-[11px] text-slate-500 leading-relaxed px-1">
        Mật khẩu chỉ dùng một lần để tải kết quả, không được lưu lại. Sau khi tải, AI sẽ đề xuất phân loại để bạn xác nhận.
      </span>
    </div>
  );
};
