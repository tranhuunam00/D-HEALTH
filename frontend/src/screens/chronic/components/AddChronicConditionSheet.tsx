import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Check, AlertCircle, Heart, Activity } from 'lucide-react';
import { BottomSheet } from '../../../components/organisms/BottomSheet';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';
import type { MetricItem } from '../useChronicLogic';

function toVnDate(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  return isoDate;
}

function fromVnDate(vnDate: string): string {
  if (!vnDate) return '';
  const parts = vnDate.split('/');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  return vnDate;
}

function getVnFullDateText(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    const d = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
    if (!isNaN(d.getTime())) {
      const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const weekday = weekdays[d.getDay()];
      return `${weekday}, ngày ${dd} tháng ${mm} năm ${yyyy}`;
    }
  }
  return '';
}

export interface ChronicConditionPayload {
  conditionName: string;
  statusSummary: string;
  nextCheckupDate: string;
  targetMetrics: MetricItem[];
}

interface AddChronicConditionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: (ChronicConditionPayload & { id?: string }) | null;
  onSubmit: (data: ChronicConditionPayload, id?: string) => void;
}

const COMMON_CONDITIONS = [
  'Tăng huyết áp',
  'Đái tháo đường Type 2',
  'Rối loạn lipid máu',
  'Gout (Gút)',
  'Hen phế quản / COPD',
  'Bệnh tim thiếu máu cục bộ',
  'Viêm gan B mạn tính',
  'Bệnh thận mạn tính',
];

const STATUS_PRESETS = [
  {
    label: 'Nguy cơ thấp · Ổn định',
    color: 'emerald',
    badge: 'Tốt',
    desc: 'Chỉ số trong ngưỡng mục tiêu',
  },
  {
    label: 'Nguy cơ trung bình · Ổn định',
    color: 'amber',
    badge: 'Theo dõi',
    desc: 'Cần duy trì theo dõi định kỳ',
  },
  {
    label: 'Nguy cơ cao · Cần khám',
    color: 'rose',
    badge: 'Cần khám',
    desc: 'Vượt ngưỡng an toàn lâm sàng',
  },
];

const METRIC_SUGGESTIONS = [
  { name: 'Huyết áp', defaultStatus: 'Theo dõi', type: 'warning' as const },
  { name: 'Nhịp tim', defaultStatus: 'Tốt', type: 'good' as const },
  { name: 'HbA1c', defaultStatus: 'Tốt', type: 'good' as const },
  { name: 'Glucose', defaultStatus: 'Theo dõi', type: 'warning' as const },
  { name: 'LDL-C', defaultStatus: 'Theo dõi', type: 'warning' as const },
  { name: 'Cân nặng', defaultStatus: 'Theo dõi', type: 'warning' as const },
  { name: 'Thận (eGFR)', defaultStatus: 'Tốt', type: 'good' as const },
  { name: 'Mắt', defaultStatus: 'Cần khám', type: 'danger' as const },
  { name: 'Acid Uric', defaultStatus: 'Theo dõi', type: 'warning' as const },
];

export const AddChronicConditionSheet: React.FC<AddChronicConditionSheetProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [conditionName, setConditionName] = useState('');
  const [statusSummary, setStatusSummary] = useState('Nguy cơ trung bình · Ổn định');
  const [selectedQuickMonth, setSelectedQuickMonth] = useState<number | null>(1);
  const [nextCheckupDate, setNextCheckupDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [displayDate, setDisplayDate] = useState(() => toVnDate(nextCheckupDate));
  const datePickerRef = useRef<HTMLInputElement>(null);

  const [selectedMetrics, setSelectedMetrics] = useState<MetricItem[]>([
    { name: 'Huyết áp', status: 'Theo dõi', type: 'warning' },
    { name: 'Nhịp tim', status: 'Tốt', type: 'good' },
    { name: 'Cân nặng', status: 'Theo dõi', type: 'warning' },
  ]);

  useEffect(() => {
    if (isOpen && initialData) {
      setConditionName(initialData.conditionName || '');
      setStatusSummary(initialData.statusSummary || 'Nguy cơ trung bình · Ổn định');
      const initDate = initialData.nextCheckupDate || '';
      setNextCheckupDate(initDate);
      setDisplayDate(toVnDate(initDate));
      setSelectedQuickMonth(null);
      setSelectedMetrics(initialData.targetMetrics ? [...initialData.targetMetrics] : []);
    } else if (isOpen && !initialData) {
      setConditionName('');
      setStatusSummary('Nguy cơ trung bình · Ổn định');
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const defDate = `${yyyy}-${mm}-${dd}`;
      setNextCheckupDate(defDate);
      setDisplayDate(toVnDate(defDate));
      setSelectedQuickMonth(1);
      setSelectedMetrics([
        { name: 'Huyết áp', status: 'Theo dõi', type: 'warning' },
        { name: 'Nhịp tim', status: 'Tốt', type: 'good' },
        { name: 'Cân nặng', status: 'Theo dõi', type: 'warning' },
      ]);
    }
  }, [isOpen, initialData]);

  const handleToggleMetric = (m: typeof METRIC_SUGGESTIONS[0]) => {
    const exists = selectedMetrics.some((item) => item.name === m.name);
    if (exists) {
      setSelectedMetrics((prev) => prev.filter((item) => item.name !== m.name));
    } else {
      setSelectedMetrics((prev) => [
        ...prev,
        { name: m.name, status: m.defaultStatus, type: m.type },
      ]);
    }
  };

  const handleCycleMetricStatus = (metricName: string) => {
    setSelectedMetrics((prev) =>
      prev.map((item) => {
        if (item.name === metricName) {
          if (item.type === 'good') {
            return { ...item, status: 'Theo dõi', type: 'warning' };
          }
          if (item.type === 'warning') {
            return { ...item, status: 'Cần khám', type: 'danger' };
          }
          return { ...item, status: 'Tốt', type: 'good' };
        }
        return item;
      })
    );
  };

  const handleSetQuickRevisit = (months: number) => {
    setSelectedQuickMonth(months);
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    setNextCheckupDate(iso);
    setDisplayDate(toVnDate(iso));
  };

  const handleDisplayDateChange = (val: string) => {
    setDisplayDate(val);
    setSelectedQuickMonth(null);
    const parts = val.split('/');
    if (parts.length === 3 && parts[2].length === 4) {
      const [dd, mm, yyyy] = parts;
      const dNum = parseInt(dd, 10);
      const mNum = parseInt(mm, 10);
      const yNum = parseInt(yyyy, 10);
      if (dNum >= 1 && dNum <= 31 && mNum >= 1 && mNum <= 12 && yNum >= 2020) {
        setNextCheckupDate(`${yyyy}-${String(mNum).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conditionName.trim()) return;

    const finalDate = nextCheckupDate || fromVnDate(displayDate);

    onSubmit(
      {
        conditionName: conditionName.trim(),
        statusSummary: statusSummary.trim(),
        nextCheckupDate: finalDate,
        targetMetrics: selectedMetrics,
      },
      initialData?.id
    );
  };

  const isEdit = !!initialData;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Chỉnh Sửa Bệnh Mạn Tính' : 'Thêm Bệnh Mạn Tính Mới'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pb-2 text-slate-800">
        {/* 1. Tên bệnh mạn tính */}
        <div className="flex flex-col gap-1.5">
          <Input
            label="Tên bệnh lý mạn tính *"
            placeholder="Ví dụ: Tăng huyết áp, Đái tháo đường Type 2..."
            value={conditionName}
            onChange={(e) => setConditionName(e.target.value)}
            required
          />

          {/* Gợi ý bệnh phổ biến */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1 pt-0.5">
            {COMMON_CONDITIONS.map((c) => {
              const active = conditionName === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setConditionName(c)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition shrink-0 border cursor-pointer ${
                    active
                      ? 'bg-[#1F7A8C] text-white border-[#1F7A8C] shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/60 hover:border-slate-300'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Tình trạng & Mức độ nguy cơ */}
        <div className="flex flex-col gap-2">
          <Input
            label="Đánh giá tình trạng & Xu hướng *"
            placeholder="Ví dụ: Nguy cơ trung bình · Ổn định"
            value={statusSummary}
            onChange={(e) => setStatusSummary(e.target.value)}
            required
          />

          {/* 3 Thẻ Mức độ nguy cơ theo chuẩn lâm sàng */}
          <div className="grid grid-cols-3 gap-2">
            {STATUS_PRESETS.map((opt) => {
              const active = statusSummary === opt.label;
              const isEmerald = opt.color === 'emerald';
              const isAmber = opt.color === 'amber';
              const isRose = opt.color === 'rose';

              const activeBg = isEmerald
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/30'
                : isAmber
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/30'
                : 'bg-rose-50 border-rose-400 ring-2 ring-rose-500/30';

              const dotBg = isEmerald ? 'bg-emerald-500' : isAmber ? 'bg-amber-500' : 'bg-rose-500';
              const textColor = isEmerald ? 'text-emerald-900' : isAmber ? 'text-amber-900' : 'text-rose-900';

              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setStatusSummary(opt.label)}
                  className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    active
                      ? activeBg
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${dotBg} shrink-0`} />
                    <span className={`text-[11px] font-bold truncate ${textColor}`}>
                      {opt.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight block">
                    {opt.label.split(' · ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Ngày hẹn tái khám tiếp theo (Chuẩn Việt Nam DD/MM/YYYY) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1F7A8C]" />
              Ngày hẹn tái khám tiếp theo * (ngày/tháng/năm)
            </label>
            <span className="text-[11px] text-slate-400">Chọn nhanh:</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Input hiển thị chuẩn Việt Nam DD/MM/YYYY kèm nút bấm mở lịch */}
            <div className="relative flex-1">
              <input
                type="text"
                value={displayDate}
                onChange={(e) => handleDisplayDateChange(e.target.value)}
                placeholder="DD/MM/YYYY (VD: 05/12/2026)"
                className="w-full min-h-[44px] pl-3.5 pr-10 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-black tracking-wide focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/20 focus:border-[#1F7A8C] transition"
                required
              />
              <button
                type="button"
                onClick={() => {
                  if (datePickerRef.current) {
                    if (typeof datePickerRef.current.showPicker === 'function') {
                      datePickerRef.current.showPicker();
                    } else {
                      datePickerRef.current.focus();
                    }
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#1F7A8C] transition cursor-pointer"
                title="Mở lịch chọn ngày"
              >
                <Calendar className="w-4 h-4" />
              </button>
              {/* Native date picker ẩn để người dùng chọn trên popup lịch khi cần */}
              <input
                ref={datePickerRef}
                type="date"
                value={nextCheckupDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setNextCheckupDate(e.target.value);
                    setDisplayDate(toVnDate(e.target.value));
                    setSelectedQuickMonth(null);
                  }
                }}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>

            {/* Quick Pills */}
            <div className="flex items-center gap-1 shrink-0">
              {[
                { label: '+1T', m: 1 },
                { label: '+2T', m: 2 },
                { label: '+3T', m: 3 },
                { label: '+6T', m: 6 },
              ].map((pill) => {
                const isSelected = selectedQuickMonth === pill.m;
                return (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() => handleSetQuickRevisit(pill.m)}
                    className={`px-2.5 py-2 rounded-xl text-[11px] font-extrabold border transition cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 text-[#1F7A8C] border-[#1F7A8C] shadow-2xs font-black'
                        : 'bg-slate-100 hover:bg-teal-50 hover:text-[#1F7A8C] hover:border-teal-200 text-slate-700 border-slate-200'
                    }`}
                    title={`Tái khám sau ${pill.m} tháng`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dòng chữ giải thích ngày hẹn tiếng Việt rõ ràng, triệt tiêu hiểu nhầm ngày/tháng */}
          {nextCheckupDate && (
            <div className="text-[11px] font-bold text-[#1F7A8C] px-1 flex items-center gap-1.5 pt-0.5">
              <span>📅 Dự kiến: {getVnFullDateText(nextCheckupDate)}</span>
              {selectedQuickMonth && (
                <span className="text-slate-500 font-normal">
                  (sau {selectedQuickMonth} tháng)
                </span>
              )}
            </div>
          )}
        </div>

        {/* 4. Các chỉ số theo dõi (Target Metrics) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#1F7A8C]" />
              Chỉ số cần theo dõi ({selectedMetrics.length})
            </label>
            <span className="text-[10px] text-slate-400">Chạm thẻ dưới để đổi mức</span>
          </div>

          {/* Preset chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {METRIC_SUGGESTIONS.map((m) => {
              const isSelected = selectedMetrics.some((item) => item.name === m.name);
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => handleToggleMetric(m)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 text-[#1F7A8C] border-teal-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{m.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-[#1F7A8C]" />}
                </button>
              );
            })}
          </div>

          {/* Selected Metrics preview & status cycling */}
          {selectedMetrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-1">
              {selectedMetrics.map((item) => {
                const isGood = item.type === 'good';
                const isWarning = item.type === 'warning';
                const colorText = isGood ? 'text-emerald-800' : isWarning ? 'text-amber-800' : 'text-rose-800';
                const bgBox = isGood
                  ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                  : isWarning
                  ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                  : 'bg-rose-50 border-rose-200 hover:border-rose-300';
                const dotBg = isGood ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500';

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleCycleMetricStatus(item.name)}
                    className={`p-2.5 rounded-2xl border ${bgBox} flex flex-col justify-between text-left h-16 transition active:scale-95 cursor-pointer shadow-2xs`}
                  >
                    <span className="text-[11px] font-bold text-slate-800 truncate block">
                      {item.name}
                    </span>
                    <div className="flex items-center justify-between w-full pt-1">
                      <div className={`flex items-center gap-1 text-[11px] font-bold ${colorText}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotBg}`} />
                        <span>{item.status || 'Theo dõi'}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">Đổi ↻</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Nút thao tác */}
        <div className="flex gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Huỷ
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {isEdit ? 'Lưu thay đổi' : 'Thêm bệnh này'}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
