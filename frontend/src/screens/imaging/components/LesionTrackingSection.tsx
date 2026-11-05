import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { TumorTrackingData } from '../useImagingLogic';

interface LesionTrackingSectionProps {
  readonly enabled: boolean;
  readonly onToggle: (nextState: boolean) => void;
  readonly trackingData: TumorTrackingData | null;
}

export const LesionTrackingSection: React.FC<LesionTrackingSectionProps> = ({
  enabled,
  onToggle,
  trackingData,
}) => {
  const [lesionType, setLesionType] = useState('ALL');
  const [location, setLocation] = useState('ALL');
  const [modality, setModality] = useState('ALL');

  return (
    <div className="flex flex-col gap-2.5">
      {/* 1. Header with Toggle Switch */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-base font-extrabold text-slate-900 block leading-tight">
            Theo dõi kích thước tổn thương
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Chọn từ các kết quả bất thường
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggle(!enabled)}
          className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
            enabled ? 'bg-[#1F7A8C]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="flex flex-col gap-2.5">
          {trackingData ? (
            <>
              {/* 2. Dropdowns filter */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-600">Loại tổn thương</label>
                  <div className="relative">
                    <select
                      value={lesionType}
                      onChange={(e) => setLesionType(e.target.value)}
                      className="w-full h-8.5 appearance-none bg-white border border-slate-200 rounded-xl px-2.5 pr-6 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="ALL">Tất cả</option>
                      <option value="solid">Khối u đặc</option>
                      <option value="cyst">Nang</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-600">Vị trí</label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-8.5 appearance-none bg-white border border-slate-200 rounded-xl px-2.5 pr-6 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="ALL">Tất cả</option>
                      <option value="liver">Gan</option>
                      <option value="lung">Phổi</option>
                      <option value="kidney">Thận</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-600">Phương tiện</label>
                  <div className="relative">
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value)}
                      className="w-full h-8.5 appearance-none bg-white border border-slate-200 rounded-xl px-2.5 pr-6 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="ALL">Tất cả</option>
                      <option value="CT">CT</option>
                      <option value="MRI">MRI</option>
                      <option value="SA">SA</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 3. Target lesion selector card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-2.5 flex items-center justify-between cursor-pointer hover:border-slate-300 transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-7 rounded-lg bg-[#CCFBF1] text-[#0F766E] text-xs font-bold flex items-center justify-center shrink-0">
                    {trackingData.subtitle.split('·')[0]?.trim() || 'MRI'}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {trackingData.targetTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {trackingData.subtitle}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <span>{trackingData.lesions?.length || 0} tổn thương</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>

              {/* 4. Lesion Chart & Table Box */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-4 flex flex-col gap-3 shadow-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-800">
                    {trackingData.targetTitle}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tổng đường kính
                    </span>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-2xl font-black text-slate-900">
                        {trackingData.currentSumMm}
                      </span>
                      <span className="text-xs font-bold text-slate-500">mm</span>
                    </div>
                  </div>
                </div>

                {/* SVG Trend Line */}
                <div className="w-full h-20 relative">
                  <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="lesionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 30 15 L 150 42 L 270 58 L 270 80 L 30 80 Z"
                      fill="url(#lesionGrad)"
                    />
                    <path
                      d="M 30 15 L 150 42 L 270 58"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="30" cy="15" r="4.5" fill="#2563EB" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="150" cy="42" r="4.5" fill="#2563EB" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="270" cy="58" r="4.5" fill="#2563EB" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>

                {/* Tracking Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] text-slate-400">
                        <th className="py-1.5 px-2 font-semibold">Tổn thương</th>
                        {trackingData.dates.map((d) => (
                          <th key={d} className="py-1.5 px-2 font-semibold">{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {trackingData.lesions.map((l) => (
                        <tr key={l.name}>
                          <td className="py-2 px-2 font-semibold text-slate-900">{l.name}</td>
                          <td className="py-2 px-2 text-slate-500">{l.val1}</td>
                          <td className="py-2 px-2 text-slate-500">{l.val2}</td>
                          <td className="py-2 px-2 font-bold text-slate-900">{l.val3}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/70 font-bold text-slate-900">
                        <td className="py-2 px-2">Tổng (mm)</td>
                        <td className="py-2 px-2 font-black">{trackingData.totalRow[0]}</td>
                        <td className="py-2 px-2 font-black">{trackingData.totalRow[1]}</td>
                        <td className="py-2 px-2 font-black text-slate-900">{trackingData.totalRow[2]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Sub-caption */}
                <span className="text-[11px] text-slate-500 font-medium">
                  {trackingData.caption}
                </span>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 text-center text-xs text-slate-400 font-medium">
              Chưa có dữ liệu tổn thương được đo lường
            </div>
          )}
        </div>
      )}
    </div>
  );
};
