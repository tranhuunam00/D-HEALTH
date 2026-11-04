import React, { useState } from 'react';
import { ArrowLeft, Camera, UploadCloud, Sparkles, CheckCircle2 } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR12Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
}

export const SCR12_CameraInputScreen: React.FC<SCR12Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
}) => {
  const [docType, setDocType] = useState<'labs' | 'imaging' | 'prescriptions'>('labs');
  const [facility, setFacility] = useState('Bệnh viện Bạch Mai');
  const [testDate, setTestDate] = useState('2026-10-26');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSimulateScan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSaved(true);
    }, 1500);
  };

  const handleSave = () => {
    alert('Đã lưu kết quả thành công vào Hồ sơ y tế số!');
    onNavigate(docType === 'labs' ? 'labs' : docType === 'imaging' ? 'imaging' : 'records');
  };

  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-20">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* 1. Header Pills */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            Hồ sơ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Topbar với nút Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('records')}
            aria-label="Quay lại"
            className="w-11 h-11 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-base font-extrabold text-slate-900 leading-tight block">
              Nhập kết quả cận lâm sàng
            </span>
            <span className="text-xs text-slate-500 font-medium">Trích xuất tự động qua AI OCR</span>
          </div>
        </div>

        {/* 3. Phân loại tài liệu */}
        <div className="flex gap-1.5 bg-slate-200/80 p-1 rounded-2xl">
          {[
            { id: 'labs', label: 'Xét nghiệm máu' },
            { id: 'imaging', label: 'Báo cáo CĐHA' },
            { id: 'prescriptions', label: 'Đơn thuốc' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDocType(tab.id as any)}
              className={`flex-1 h-8 rounded-xl text-xs font-bold transition ${
                docType === tab.id
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Upload / Camera Area */}
        <div className="bg-white rounded-3xl p-5 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 text-center">
          <div className="w-14 h-14 rounded-full bg-teal-50 text-[#1F7A8C] flex items-center justify-center">
            <Camera className="w-7 h-7" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">Chụp ảnh phiếu khám hoặc tải tệp</span>
            <span className="text-xs text-slate-400">Hỗ trợ JPG, PNG, PDF hoặc DICOM</span>
          </div>

          <div className="flex gap-2 w-full pt-1">
            <button
              onClick={handleSimulateScan}
              disabled={isProcessing}
              className="flex-1 h-11 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Camera className="w-4 h-4" />
              <span>Chụp ảnh</span>
            </button>
            <button
              onClick={handleSimulateScan}
              disabled={isProcessing}
              className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200 active:scale-95 transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Tải file</span>
            </button>
          </div>

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1F7A8C] pt-1 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Gemini AI OCR đang quét & trích xuất chỉ số...</span>
            </div>
          )}

          {isSaved && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã trích xuất thành công 18 chỉ số</span>
            </div>
          )}
        </div>

        {/* 5. Thông tin phiếu khám xác nhận */}
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-3 shadow-xs border border-slate-200/60 text-xs">
          <div>
            <label className="text-slate-500 font-semibold block mb-1">CƠ SỞ Y TẾ THỰC HIỆN</label>
            <input
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-[#1F7A8C]"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">NGÀY KHÁM / XÉT NGHIỆM</label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-[#1F7A8C]"
            />
          </div>
        </div>

        {/* 6. Action Submit */}
        <button
          onClick={handleSave}
          className="h-12 rounded-2xl bg-[#111827] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow active:scale-95 transition"
        >
          <span>Lưu vào hồ sơ sức khoẻ</span>
        </button>
      </div>

      {/* 7. Bottom Navigation */}
      <HomeBottomNav
        activeTab="records"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
