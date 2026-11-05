import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Activity, Info, Target } from 'lucide-react';
import { TumorTrackingData, normalizeModality, EvaluationHistoryItem } from '../useImagingLogic';
import {
  IMAGING_TAXONOMY,
  getBodyPartsForModality,
} from '../../../constants/imaging-taxonomy';

interface LesionTrackingSectionProps {
  readonly enabled: boolean;
  readonly onToggle: (nextState: boolean) => void;
  readonly trackingData: TumorTrackingData | null;
}

interface LesionGroup {
  key: string;
  modality: string;
  organ: string;
  targetTitle: string;
  currentMm: number;
  count: number;
  latest: EvaluationHistoryItem;
  history: EvaluationHistoryItem[];
}

function getGroupKey(item: EvaluationHistoryItem): string {
  const mod = normalizeModality(item.modality, item.title || item.lesion_location);
  const organ = (item.organ || item.body_part || 'Khác').trim().toLowerCase();
  const rawLoc = (item.lesion_location || organ).split('·')[0].trim().toLowerCase();
  return `${mod}_${organ}_${rawLoc}`;
}

export const LesionTrackingSection: React.FC<LesionTrackingSectionProps> = ({
  enabled,
  onToggle,
  trackingData,
}) => {
  const [modality, setModality] = useState('ALL');
  const [location, setLocation] = useState('ALL');
  const [lesionType, setLesionType] = useState('ALL');
  const [selectedGroupKey, setSelectedGroupKey] = useState<string>('');

  // 1. Danh sách Vị trí / Bộ phận: Tự động trích xuất TẤT CẢ vị trí có trong DB của bệnh nhân + danh mục chuẩn
  const availableBodyParts = useMemo(() => {
    const list: { id: string; name: string }[] = [];
    const seen = new Set<string>();

    const addPart = (name?: string, id?: string) => {
      if (!name) return;
      const clean = name.trim();
      if (!clean || seen.has(clean.toLowerCase())) return;
      seen.add(clean.toLowerCase());
      list.push({ id: id || clean, name: clean });
    };

    // Ưu tiên 1: Dữ liệu thực tế của bệnh nhân
    if (trackingData?.history) {
      for (const item of trackingData.history) {
        if (modality !== 'ALL') {
          const itemMod = normalizeModality(item.modality, item.title || item.lesion_location);
          if (itemMod.toUpperCase() !== modality.toUpperCase()) continue;
        }
        if (item.organ) addPart(item.organ);
        if (item.body_part) addPart(item.body_part);
      }
    }

    // Ưu tiên 2: Danh mục chuẩn IMAGING_TAXONOMY
    const mods = modality === 'ALL'
      ? IMAGING_TAXONOMY
      : IMAGING_TAXONOMY.filter((m) => m.code === modality || m.id === modality);

    for (const m of mods) {
      for (const bp of m.bodyParts) {
        addPart(bp.name, bp.id);
      }
    }

    return list;
  }, [trackingData, modality]);

  // 2. Danh sách Loại tổn thương: Tự động trích xuất các loại tổn thương thực tế + danh mục chuẩn
  const availableLesionTypes = useMemo(() => {
    const list: { id: string; name: string }[] = [];
    const seen = new Set<string>();

    const addType = (name?: string, id?: string) => {
      if (!name) return;
      const clean = name.trim();
      if (!clean || seen.has(clean.toLowerCase())) return;
      seen.add(clean.toLowerCase());
      list.push({ id: id || clean, name: clean });
    };

    if (trackingData?.history) {
      for (const item of trackingData.history) {
        if (modality !== 'ALL') {
          const itemMod = normalizeModality(item.modality, item.title || item.lesion_location);
          if (itemMod.toUpperCase() !== modality.toUpperCase()) continue;
        }
        if (location !== 'ALL') {
          const organFull = `${item.organ || ''} ${item.body_part || ''} ${item.lesion_location || ''}`.toLowerCase();
          const targetLoc = location.toLowerCase();
          if (!organFull.includes(targetLoc) && !targetLoc.includes((item.organ || '').toLowerCase())) continue;
        }
        if (item.lesion_type) addType(item.lesion_type);
        if (item.lesion_location) {
          const firstPart = item.lesion_location.split('·')[0].trim();
          if (firstPart) addType(firstPart);
        }
      }
    }

    const parts = getBodyPartsForModality(modality === 'ALL' ? 'CT' : modality);
    for (const bp of parts) {
      for (const lt of bp.lesionTypes) {
        addType(lt.name, lt.id);
      }
    }

    return list;
  }, [trackingData, modality, location]);

  const handleModalityChange = (nextMod: string) => {
    setModality(nextMod);
    setLocation('ALL');
    setLesionType('ALL');
  };

  const handleLocationChange = (nextLoc: string) => {
    setLocation(nextLoc);
    setLesionType('ALL');
  };

  // 3. Lọc danh sách lịch sử theo 3 tầng bộ lọc
  const filteredHistory = useMemo(() => {
    if (!trackingData || !trackingData.history) return [];
    return trackingData.history.filter((item) => {
      if (modality !== 'ALL') {
        const itemNorm = normalizeModality(item.modality, item.title || item.lesion_location);
        if (itemNorm.toUpperCase() !== modality.toUpperCase()) return false;
      }
      if (location !== 'ALL') {
        const organText = `${item.organ || ''} ${item.body_part || ''} ${item.lesion_location || ''}`.toLowerCase();
        const targetLoc = location.toLowerCase().trim();
        const itemOrgan = (item.organ || '').toLowerCase().trim();
        const itemBp = (item.body_part || '').toLowerCase().trim();
        const match = organText.includes(targetLoc) || targetLoc.includes(itemOrgan) || (itemBp && targetLoc.includes(itemBp));
        if (!match) return false;
      }
      if (lesionType !== 'ALL') {
        const typeText = `${item.lesion_type || ''} ${item.lesion_location || ''}`.toLowerCase();
        const targetType = lesionType.toLowerCase().trim();
        if (!typeText.includes(targetType) && !targetType.includes((item.lesion_type || '').toLowerCase())) return false;
      }
      return true;
    });
  }, [trackingData, modality, location, lesionType]);

  // 4. Nhóm các bản ghi theo từng khối tổn thương đích độc lập (không gộp nhầm tổn thương khác vị trí)
  const lesionGroups = useMemo<LesionGroup[]>(() => {
    if (filteredHistory.length === 0) return [];
    const groupMap = new Map<string, EvaluationHistoryItem[]>();

    for (const item of filteredHistory) {
      const key = getGroupKey(item);
      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key)!.push(item);
    }

    return Array.from(groupMap.entries()).map(([key, items]) => {
      const sorted = [...items].sort((a, b) => new Date(a.performed_at).getTime() - new Date(b.performed_at).getTime());
      const latest = sorted[sorted.length - 1];
      return {
        key,
        modality: latest.modality || 'CĐHA',
        organ: latest.organ || latest.body_part || 'Vị trí',
        targetTitle: latest.lesion_location || `${latest.organ || 'Tổn thương'}`,
        currentMm: Number(latest.current_sum_diameters_mm) || 0,
        count: latest.lesion_count || 1,
        latest,
        history: sorted,
      };
    });
  }, [filteredHistory]);

  // Đồng bộ nhóm đang chọn
  useEffect(() => {
    if (lesionGroups.length > 0) {
      if (!selectedGroupKey || !lesionGroups.some((g) => g.key === selectedGroupKey)) {
        setSelectedGroupKey(lesionGroups[0].key);
      }
    } else {
      setSelectedGroupKey('');
    }
  }, [lesionGroups, selectedGroupKey]);

  const activeGroup = useMemo(() => {
    return lesionGroups.find((g) => g.key === selectedGroupKey) || lesionGroups[0] || null;
  }, [lesionGroups, selectedGroupKey]);

  const hasData = Boolean(activeGroup && activeGroup.history.length > 0);
  const latestItem = activeGroup?.latest || null;
  const activeHistory = activeGroup?.history || [];

  const dates = activeHistory.map((item) => {
    try {
      const d = new Date(item.performed_at);
      if (isNaN(d.getTime())) return item.performed_at;
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    } catch {
      return item.performed_at;
    }
  });

  const totalRow = activeHistory.map((item) => Number(item.current_sum_diameters_mm) || 0);

  // SVG dynamic chart calculations trên đúng tổn thương đang chọn
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
          {/* 2. Bộ lọc 3 tầng */}
          <div className="grid grid-cols-3 gap-1.5">
            {/* Cột 1: Phương tiện */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">Phương tiện</label>
              <div className="relative">
                <select
                  value={modality}
                  onChange={(e) => handleModalityChange(e.target.value)}
                  className="w-full h-10.5 min-h-[42px] appearance-none bg-white border border-slate-200 rounded-xl px-2.5 pr-6 text-xs font-bold text-slate-800 focus:outline-none truncate shadow-xs active:bg-slate-50"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="CT">CT (Cắt lớp)</option>
                  <option value="MRI">MRI (Cộng hưởng)</option>
                  <option value="MM">MM (Nhũ ảnh)</option>
                  <option value="SA">SA (Siêu âm)</option>
                  <option value="XQ">XQ (X-quang)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Cột 2: Vị trí (Tự động cập nhật từ DB) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">Vị trí</label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full h-10.5 min-h-[42px] appearance-none bg-white border border-slate-200 rounded-xl px-2.5 pr-6 text-xs font-bold text-slate-800 focus:outline-none truncate shadow-xs active:bg-slate-50"
                >
                  <option value="ALL">Tất cả</option>
                  {availableBodyParts.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Cột 3: Loại tổn thương */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">Loại tổn thương</label>
              <div className="relative">
                <select
                  value={lesionType}
                  onChange={(e) => setLesionType(e.target.value)}
                  className="w-full h-10.5 min-h-[42px] appearance-none bg-white border border-slate-200 rounded-xl px-2.5 pr-6 text-xs font-bold text-slate-800 focus:outline-none truncate shadow-xs active:bg-slate-50"
                >
                  <option value="ALL">Tất cả</option>
                  {availableLesionTypes.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-3.5 pointer-events-none" />
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
            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 text-center text-xs text-slate-500 font-medium leading-relaxed shadow-xs">
              Chưa có số đo kích thước tổn thương nào cho <span className="font-bold text-slate-800">{modality === 'ALL' ? 'bộ lọc này' : modality}</span>.
              <span className="block text-[11px] text-slate-400 mt-1">
                (Các phiếu CĐHA đã lưu đều có kết quả bình thường hoặc chưa ghi nhận kích thước mm dạng khối).
              </span>
            </div>
          ) : (
            <>
              {/* 4. Bộ chọn nhanh tổn thương đích khi có nhiều khối u trong hồ sơ */}
              {lesionGroups.length > 1 && (
                <div className="flex flex-col gap-1.5 bg-slate-100/70 p-2.5 rounded-2xl border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                    <Target className="w-3.5 h-3.5 text-[#1F7A8C]" />
                    <span>Chọn tổn thương đích đang theo dõi ({lesionGroups.length} khối):</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                    {lesionGroups.map((g) => {
                      const isSelected = activeGroup?.key === g.key;
                      return (
                        <button
                          key={g.key}
                          type="button"
                          onClick={() => setSelectedGroupKey(g.key)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 border ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-teal-400' : 'bg-slate-300'}`} />
                          <span className="truncate max-w-[150px]">{g.modality} · {g.targetTitle.split('·')[0]}</span>
                          <span className={`text-[11px] font-black ${isSelected ? 'text-teal-300' : 'text-[#1F7A8C]'}`}>
                            {g.currentMm} mm
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Target lesion card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-2.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-10 h-7 rounded-lg bg-[#CCFBF1] text-[#0F766E] text-xs font-black flex items-center justify-center shrink-0">
                    {latestItem?.modality || activeGroup?.modality || 'CĐHA'}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                      {latestItem?.lesion_location || `${latestItem?.organ || 'Tổn thương'}`}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                      {latestItem?.modality || 'CĐHA'} · {latestItem?.lesion_count || 1} tổn thương · {dates[dates.length - 1]}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-2">
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
                    {activeHistory.length} lần đo
                  </span>
                </div>

                {/* SVG Biểu đồ xu hướng ĐỘNG (chỉ vẽ khi tổn thương này có từ 2 lần đo trở lên) */}
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
                      Hệ thống sẽ tự động vẽ biểu đồ khi có lần đo tiếp theo cho tổn thương này.
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
