import React, { useState, useEffect } from 'react';
import { Plus, X, Heart, Droplet, Shield, Activity, Calendar } from 'lucide-react';
import { BottomSheet } from '../../../components/organisms/BottomSheet';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';
import type { MetricItem } from '../useChronicLogic';

export interface ChronicConditionPayload {
  conditionName: string;
  statusSummary: string;
  nextCheckupDate: string;
  targetMetrics: MetricItem[];
}

interface AddChronicConditionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ChronicConditionPayload & { id?: string } | null;
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
  const [statusSummary, setStatusSummary] = useState('Nguy cơ trung bình · xu hướng ổn định');
  const [nextCheckupDate, setNextCheckupDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedMetrics, setSelectedMetrics] = useState<MetricItem[]>([
    { name: 'Huyết áp', status: 'Theo dõi', type: 'warning' },
    { name: 'Nhịp tim', status: 'Tốt', type: 'good' },
    { name: 'Cân nặng', status: 'Theo dõi', type: 'warning' },
  ]);

  useEffect(() => {
    if (isOpen && initialData) {
      setConditionName(initialData.conditionName || '');
      setStatusSummary(initialData.statusSummary || 'Nguy cơ trung bình · xu hướng ổn định');
      setNextCheckupDate(initialData.nextCheckupDate || '');
      setSelectedMetrics(initialData.targetMetrics ? [...initialData.targetMetrics] : []);
    } else if (isOpen && !initialData) {
      setConditionName('');
      setStatusSummary('Nguy cơ trung bình · xu hướng ổn định');
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      setNextCheckupDate(d.toISOString().split('T')[0]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conditionName.trim()) return;

    onSubmit(
      {
        conditionName: conditionName.trim(),
        statusSummary: statusSummary.trim(),
        nextCheckupDate,
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
      <form onSubmit={handleSubmit} className="space-y-3.5 pb-2">
        {/* 1. Tên bệnh mạn tính */}
        <div className="flex flex-col gap-1.5">
          <Input
            label="Tên bệnh mạn tính"
            placeholder="Ví dụ: Tăng huyết áp, Đái tháo đường..."
            value={conditionName}
            onChange={(e) => setConditionName(e.target.value)}
            required
          />
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {COMMON_CONDITIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setConditionName(c)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition shrink-0 border ${
                  conditionName === c
                    ? 'bg-[#BE123C] text-white border-[#BE123C]'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Tình trạng / Tóm tắt nguy cơ */}
        <div className="flex flex-col gap-1.5">
          <Input
            label="Đánh giá tình trạng & Xu hướng"
            placeholder="Ví dụ: Nguy cơ trung bình · xu hướng ổn định"
            value={statusSummary}
            onChange={(e) => setStatusSummary(e.target.value)}
            required
          />
          <div className="grid grid-cols-3 gap-1.5">
            {[
              'Nguy cơ thấp · Ổn định',
              'Nguy cơ trung bình · Ổn định',
              'Nguy cơ cao · Cần khám',
            ].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setStatusSummary(opt)}
                className={`p-1.5 rounded-xl text-[10px] font-bold text-center border transition ${
                  statusSummary === opt
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Ngày tái khám dự kiến */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Ngày hẹn tái khám tiếp theo
          </label>
          <input
            type="date"
            value={nextCheckupDate}
            onChange={(e) => setNextCheckupDate(e.target.value)}
            className="w-full min-h-[42px] px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/20 focus:border-[#1F7A8C]"
            required
          />
        </div>

        {/* 4. Các chỉ số theo dõi (Target Metrics) */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900">
              Chỉ số cần theo dõi ({selectedMetrics.length})
            </label>
            <span className="text-[11px] text-slate-400">Chạm để đổi Tốt / Theo dõi / Cần khám</span>
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
                  className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 border ${
                    isSelected
                      ? 'bg-teal-50 text-[#1F7A8C] border-teal-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-500 border-transparent hover:border-slate-300'
                  }`}
                >
                  <span>{m.name}</span>
                  {isSelected && <span className="text-[10px]">✓</span>}
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
                const colorText = isGood ? 'text-emerald-700' : isWarning ? 'text-amber-700' : 'text-rose-700';
                const bgBox = isGood ? 'bg-emerald-50 border-emerald-200' : isWarning ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200';
                const dotBg = isGood ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500';

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleCycleMetricStatus(item.name)}
                    className={`p-2 rounded-2xl border ${bgBox} flex flex-col justify-between text-left h-14 transition active:scale-95`}
                  >
                    <span className="text-[10px] font-bold text-slate-700 truncate block">
                      {item.name}
                    </span>
                    <div className={`flex items-center gap-1 text-[11px] font-black ${colorText}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotBg}`} />
                      <span>{item.status || 'Theo dõi'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Nút thao tác */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
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

