import React, { useState, useMemo } from 'react';
import { ChevronDown, Activity, Info } from 'lucide-react';
import { TumorTrackingData } from '../useImagingLogic';
import {
  IMAGING_TAXONOMY,
  getBodyPartsForModality,
  getLesionTypesForBodyPart,
} from '../../../constants/imaging-taxonomy';

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
  // Sắp xếp thứ tự phân cấp 3 tầng: Phương tiện -> Vị trí -> Loại tổn thương
  const [modality, setModality] = useState('ALL');
  const [location, setLocation] = useState('ALL');
  const [lesionType, setLesionType] = useState('ALL');

  // 1. Danh sách Vị trí / Bộ phận phụ thuộc vào Phương tiện
  const availableBodyParts = useMemo(() => {
    if (modality === 'ALL') {
      const set = new Map<string, string>();
      for (const m of IMAGING_TAXONOMY) {
        for (const bp of m.bodyParts) {
          if (!set.has(bp.name)) set.set(bp.name, bp.id);
        }
      }
      return Array.from(set.entries()).map(([name, id]) => ({ id, name }));
    }
    return getBodyPartsForModality(modality);
  }, [modality]);

  // 2. Danh sách Loại tổn thương phụ thuộc vào Phương tiện & Vị trí
  const availableLesionTypes = useMemo(() => {
    if (modality === 'ALL' && location === 'ALL') {
      const set = new Map<string, string>();
      for (const m of IMAGING_TAXONOMY) {
        for (const bp of m.bodyParts) {
          for (const lt of bp.lesionTypes) {
            if (!set.has(lt.name)) set.set(lt.name, lt.id);
          }
        }
      }
      return Array.from(set.entries()).map(([name, id]) => ({ id, name }));
    }
    if (location !== 'ALL') {
      if (modality !== 'ALL') {
        return getLesionTypesForBodyPart(modality, location);
      }
      // Modality ALL, find lesion types for that body part name
      const set = new Map<string, string>();
      for (const m of IMAGING_TAXONOMY) {
        const bp = m.bodyParts.find((b) => b.name === location || b.id === location);
        if (bp) {
          for (const lt of bp.lesionTypes) {
            if (!set.has(lt.name)) set.set(lt.name, lt.id);
          }
        }
      }
      return Array.from(set.entries()).map(([name, id]) => ({ id, name }));
    }
    // Location is ALL, but modality is specific
    const parts = getBodyPartsForModality(modality);
    const set = new Map<string, string>();
    for (const bp of parts) {
      for (const lt of bp.lesionTypes) {
        if (!set.has(lt.name)) set.set(lt.name, lt.id);
      }
    }
    return Array.from(set.entries()).map(([name, id]) => ({ id, name }));
  }, [modality, location]);

  const handleModalityChange = (nextMod: string) => {
    setModality(nextMod);
    setLocation('ALL');
    setLesionType('ALL');
  };

  const handleLocationChange = (nextLoc: string) => {
    setLocation(nextLoc);
    setLesionType('ALL');
  };

  // 3. Lọc lịch sử từ DB theo 3 tầng phân cấp
  const filteredHistory = useMemo(() => {
    if (!trackingData || !trackingData.history) return [];
    return trackingData.history.filter((item) => {
      if (modality !== 'ALL') {
        const itemMod = (item.modality || '').toUpperCase();
        if (itemMod !== modality.toUpperCase()) return false;
      }
      if (location !== 'ALL') {
        const organText = `${item.organ || ''} ${item.body_part || ''} ${item.lesion_location || ''}`.toLowerCase();
        const targetLoc = location.toLowerCase();
        if (!organText.includes(targetLoc)) return false;
      }
      if (lesionType !== 'ALL') {
        const typeText = `${item.lesion_type || ''} ${item.lesion_location || ''}`.toLowerCase();
        const targetType = lesionType.toLowerCase();
        if (!typeText.includes(targetType)) return false;
      }
      return true;
    });
  }, [trackingData, modality, location, lesionType]);

  const hasData = filteredHistory.length > 0;
  const latestItem = hasData ? filteredHistory[filteredHistory.length - 1] : null;
  const dates = filteredHistory.map((item) => {
    try {
      const d = new Date(item.performed_at);
      if (isNaN(d.getTime())) return item.performed_at;
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    } catch {
      return item.performed_at;
    }
  });
  const totalRow = filteredHistory.map((item) => Number(item.current_sum_diameters_mm) || 0);

  // SVG dynamic chart calculations
  const chartPoints = useMemo(() => {
    if (totalRow.length < 2) return null;
    const minVal = Math.min(...totalRow);
    const maxVal = Math.max(...totalRow);
    const range = maxVal - minVal;

    const width = 280;
    const height = 65;
    const topPadding = 12;
    const bottomPadding = 15;
    const usableHeight = height - topPadding - bottomPadding;

    const points = totalRow.map((val, idx) => {
      const x = 20 + (idx * (width - 40)) / (totalRow.length - 1);
      const y = range === 0 ? topPadding + usableHeight / 2 : topPadding + ((maxVal - val) / range) * usableHeight;
      return { x, y, val };
    });

    const linePath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');
    const firstP = points[0];
    const lastP = points[points.length - 1];
    const areaPath = `${linePath} L ${lastP.x.toFixed(1)} ${height} L ${firstP.x.toFixed(1)} ${height} Z`;

    return { points, linePath, areaPath, minVal, maxVal };
  }, [totalRow]);

  return (
    <div className="flex flex-col gap-2.5">
      {/* 1. Header with Toggle Switch */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-base font-extrabold text-slate-900 block leading-tight">
            Theo dõi kích thước tổn thương
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Phân cấp: Phương tiện → Vị trí → Loại tổn thương
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
          {/* 2. Sắp xếp thứ tự bộ lọc: Phương tiện -> Vị trí -> Loại tổn thương */}
          <div className="grid grid-cols-3 gap-1.5">
            {/* Cột 1: Phương tiện */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">Phương tiện</label>
              <div className="relative">
                <select
                  value={modality}
                  onChange={(e) => handleModalityChange(e.target.value)}
                  className="w-full h-8.5 appearance-none bg-white border border-slate-200 rounded-xl px-2.5 pr-6 text-xs font-semibold text-slate-800 focus:outline-none truncate"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="CT">CT (Cắt lớp)</option>
                  <option value="MRI">MRI (Cộng hưởng từ)</option>
                  <option value="MM">MM (Nhũ ảnh)</option>
                  <option value="SA">SA (Siêu âm)</option>
                  <option value="XQ">XQ (X-quang)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Cột 2: Vị trí (phụ thuộc vào Phương tiện) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">Vị trí</label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full h-8.5 appearance-none bg-white border border-slate-200 rounded-xl px-2.5 pr-6 text-xs font-semibold text-slate-800 focus:outline-none truncate"
                >
                  <option value="ALL">Tất cả</option>
                  {availableBodyParts.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Cột 3: Loại tổn thương (phụ thuộc vào Vị trí) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">Loại tổn thương</label>
              <div className="relative">
                <select
                  value={lesionType}
                  onChange={(e) => setLesionType(e.target.value)}
                  className="w-full h-8.5 appearance-none bg-white border border-slate-200 rounded-xl px-2.5 pr-6 text-xs font-semibold text-slate-800 focus:outline-none truncate"
                >
                  <option value="ALL">Tất cả</option>
                  {availableLesionTypes.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 3. Hiển thị nội dung đo lường thật từ CSDL */}
          {!trackingData ? (
            <div className="bg-white rounded-3xl border border-slate-200/60 p-5 flex flex-col items-center justify-center text-center gap-2 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#1F7A8C] flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Chưa có số đo tổn thương trong hồ sơ</span>
              <p className="text-[11px] text-slate-500 max-w-[280px] leading-relaxed">
                Khi bạn nhập kết quả CĐHA có ghi nhận kích thước mm, dữ liệu và biểu đồ sẽ tự động kết xuất trực tiếp từ CSDL tại đây.
              </p>
            </div>
          ) : !hasData ? (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 text-center text-xs text-slate-500 font-medium">
              Không có số đo nào khớp với bộ lọc <span className="font-bold text-slate-800">[{modality} · {location} · {lesionType}]</span>.
            </div>
          ) : (
            <>
              {/* Target lesion card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-2.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-7 rounded-lg bg-[#CCFBF1] text-[#0F766E] text-xs font-bold flex items-center justify-center shrink-0">
                    {latestItem?.modality || modality !== 'ALL' ? modality : 'CĐHA'}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {latestItem?.lesion_location || `${latestItem?.organ || 'Tổn thương'}`}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {latestItem?.modality || 'CĐHA'} · {latestItem?.lesion_count || 1} tổn thương · {dates[dates.length - 1]}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Đường kính hiện tại
                  </span>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-lg font-black text-slate-900">
                      {latestItem?.current_sum_diameters_mm || 0}
                    </span>
                    <span className="text-xs font-bold text-slate-500">mm</span>
                  </div>
                </div>
              </div>

              {/* Chart & Table Card */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-4 flex flex-col gap-3 shadow-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-800">
                    Diễn biến kích thước theo thời gian
                  </span>
                  <span className="text-[11px] font-bold text-[#1F7A8C]">
                    {filteredHistory.length} lần đo
                  </span>
                </div>

                {/* SVG Biểu đồ xu hướng ĐỘNG (chỉ vẽ khi có từ 2 lần đo trở lên) */}
                {chartPoints ? (
                  <div className="w-full h-20 relative">
                    <svg viewBox="0 0 280 65" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="realLesionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#1F7A8C" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#1F7A8C" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d={chartPoints.areaPath} fill="url(#realLesionGrad)" />
                      <path
                        d={chartPoints.linePath}
                        fill="none"
                        stroke="#1F7A8C"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {chartPoints.points.map((p, idx) => (
                        <g key={idx}>
                          <circle cx={p.x} cy={p.y} r="4" fill="#1F7A8C" stroke="#ffffff" strokeWidth="2" />
                          <text
                            x={p.x}
                            y={p.y - 7}
                            textAnchor="middle"
                            fontSize="9"
                            fontWeight="bold"
                            fill="#0F766E"
                          >
                            {p.val} mm
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                ) : (
                  <div className="bg-teal-50/60 rounded-2xl p-3 border border-teal-100 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#1F7A8C] shrink-0 mt-0.5" />
                    <div className="text-[11px] text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-800 block">
                        Số đo lần đầu (Baseline): {latestItem?.current_sum_diameters_mm} mm
                      </span>
                      Hệ thống sẽ tự động vẽ biểu đồ xu hướng tăng/giảm khi có từ 2 lần đo trở lên.
                    </div>
                  </div>
                )}

                {/* Bảng dữ liệu thật từ DB */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] text-slate-400">
                        <th className="py-1.5 px-2 font-semibold">Chỉ tiêu</th>
                        {dates.map((d, i) => (
                          <th key={i} className="py-1.5 px-2 font-semibold text-center">{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      <tr className="bg-slate-50/70 font-bold text-slate-900">
                        <td className="py-2 px-2">Tổng đường kính</td>
                        {totalRow.map((val, i) => (
                          <td key={i} className="py-2 px-2 font-black text-center text-[#1F7A8C]">
                            {val} mm
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Ghi chú phản hồi điều trị */}
                {latestItem?.treatment_response_note && (
                  <span className="text-[11px] text-slate-500 font-medium italic border-t border-slate-100 pt-2 block">
                    {latestItem.treatment_response_note}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
