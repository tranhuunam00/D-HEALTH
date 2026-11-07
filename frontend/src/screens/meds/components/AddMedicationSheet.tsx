import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { BottomSheet } from '../../../components/organisms/BottomSheet';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';

export type MedicationDurationMode = '3days' | '5days' | '1week' | 'daily' | 'custom';

export interface AddMedicationPayload {
  medicationName: string;
  dosage: string;
  timingInstructions: string;
  scheduledTime: string;
  durationMode: MedicationDurationMode;
  startDate: string;
  endDate: string;
  durationDays: number;
}

export interface EditMedicationInitialData {
  id?: string;
  scheduleId?: string;
  medicationName: string;
  dosage?: string;
  scheduledTime?: string;
  timingInstructions?: string;
  durationMode?: MedicationDurationMode;
  endDate?: string;
}

interface AddMedicationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EditMedicationInitialData | null;
  onSubmit: (data: AddMedicationPayload, editId?: string) => void;
}

function formatDateVN(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export const AddMedicationSheet: React.FC<AddMedicationSheetProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('500 mg');
  const [timingInstructions, setTimingInstructions] = useState('1 viên · sau ăn');
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [durationMode, setDurationMode] = useState<MedicationDurationMode>('daily');

  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [customStartDate, setCustomStartDate] = useState(todayStr);
  const [customEndDate, setCustomEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // Pre-fill fields if editing
  useEffect(() => {
    if (isOpen && initialData) {
      setMedicationName(initialData.medicationName || '');
      setDosage(initialData.dosage || '500 mg');
      setTimingInstructions(initialData.timingInstructions || '1 viên · sau ăn');
      setScheduledTime((initialData.scheduledTime || '08:00').slice(0, 5));
      setDurationMode(initialData.durationMode || 'daily');
      if (initialData.endDate) {
        setCustomEndDate(initialData.endDate);
      }
    } else if (isOpen && !initialData) {
      setMedicationName('');
      setDosage('500 mg');
      setTimingInstructions('1 viên · sau ăn');
      setScheduledTime('08:00');
      setDurationMode('daily');
    }
  }, [isOpen, initialData]);

  const durationInfo = useMemo(() => {
    const baseDate = new Date(todayStr);

    if (durationMode === '3days') {
      const endD = new Date(baseDate);
      endD.setDate(endD.getDate() + 2);
      const endStr = endD.toISOString().split('T')[0];
      return {
        startDate: todayStr,
        endDate: endStr,
        days: 3,
        label: '⏱️ Uống trong 3 ngày',
        subtext: `Từ ${formatDateVN(todayStr)} đến ${formatDateVN(endStr)}`,
      };
    }

    if (durationMode === '5days') {
      const endD = new Date(baseDate);
      endD.setDate(endD.getDate() + 4);
      const endStr = endD.toISOString().split('T')[0];
      return {
        startDate: todayStr,
        endDate: endStr,
        days: 5,
        label: '⏱️ Uống trong 5 ngày',
        subtext: `Từ ${formatDateVN(todayStr)} đến ${formatDateVN(endStr)}`,
      };
    }

    if (durationMode === '1week') {
      const endD = new Date(baseDate);
      endD.setDate(endD.getDate() + 6);
      const endStr = endD.toISOString().split('T')[0];
      return {
        startDate: todayStr,
        endDate: endStr,
        days: 7,
        label: '⏱️ Uống trong 1 tuần (7 ngày)',
        subtext: `Từ ${formatDateVN(todayStr)} đến ${formatDateVN(endStr)}`,
      };
    }

    if (durationMode === 'custom') {
      const s = new Date(customStartDate || todayStr);
      const e = new Date(customEndDate || customStartDate || todayStr);
      const diffMs = e.getTime() - s.getTime();
      const days = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
      const effEnd = customEndDate || customStartDate || todayStr;
      return {
        startDate: customStartDate || todayStr,
        endDate: effEnd,
        days,
        label: `📅 Khoảng thời gian: ${days} ngày`,
        subtext: `Từ ${formatDateVN(customStartDate || todayStr)} đến ${formatDateVN(effEnd)}`,
      };
    }

    // Daily / Hàng ngày
    const endD = new Date(baseDate);
    endD.setDate(endD.getDate() + 365);
    return {
      startDate: todayStr,
      endDate: endD.toISOString().split('T')[0],
      days: 365,
      label: '🔄 Hàng ngày (Daily)',
      subtext: `Duy trì đều đặn mỗi ngày từ ${formatDateVN(todayStr)}`,
    };
  }, [durationMode, todayStr, customStartDate, customEndDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationName.trim()) return;

    const payload: AddMedicationPayload = {
      medicationName: medicationName.trim(),
      dosage,
      timingInstructions,
      scheduledTime: `${scheduledTime.slice(0, 5)}:00`,
      durationMode,
      startDate: durationInfo.startDate,
      endDate: durationInfo.endDate,
      durationDays: durationInfo.days,
    };

    const targetId = initialData?.scheduleId || initialData?.id;
    onSubmit(payload, targetId);
  };

  const isEdit = !!initialData;
  const sheetTitle = isEdit ? 'Chỉnh Sửa Thuốc & Lịch Nhắc' : 'Thêm thuốc vào lịch nhắc';

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={sheetTitle}>
      <form onSubmit={handleSubmit} className="space-y-3.5 pb-2">
        {/* Banner lưu ý: Sửa thì tính từ lúc sửa */}
        {isEdit && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs">
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-500 block">
                Sửa thì tính từ lúc sửa:
              </span>
              <span className="text-slate-600 text-[11px] leading-relaxed">
                Lịch nhắc và các liều mới sẽ được tự động tính bắt đầu từ hôm nay ({formatDateVN(todayStr)}) trở đi. Dữ liệu lịch sử trước đây vẫn được giữ nguyên.
              </span>
            </div>
          </div>
        )}

        {/* 1. Tên thuốc */}
        <Input
          label="Tên thuốc"
          placeholder="Ví dụ: Metformin, Losartan"
          value={medicationName}
          onChange={(e) => setMedicationName(e.target.value)}
          required
        />

        {/* 2. Hàm lượng & Giờ uống */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Hàm lượng"
            placeholder="Ví dụ: 500 mg"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
          <Input
            label="Giờ uống"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
        </div>

        {/* 3. Lựa chọn thời gian dùng thuốc: 3 ngày, 5 ngày, 1 tuần, daily hoặc khoảng thời gian */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Thời gian dùng thuốc (Lịch nhắc)
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: '3days', label: '3 ngày' },
              { id: '5days', label: '5 ngày' },
              { id: '1week', label: '1 tuần' },
              { id: 'daily', label: 'Hàng ngày' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDurationMode(opt.id as MedicationDurationMode)}
                className={`h-9 min-h-[36px] rounded-xl text-xs font-bold transition flex items-center justify-center border ${
                  durationMode === opt.id
                    ? 'bg-[#1F7A8C] text-white border-[#1F7A8C] shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setDurationMode('custom')}
            className={`w-full h-9 min-h-[36px] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border mt-0.5 ${
              durationMode === 'custom'
                ? 'bg-[#1F7A8C] text-white border-[#1F7A8C] shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Khoảng thời gian tuỳ chọn</span>
          </button>

          {durationMode === 'custom' && (
            <div className="grid grid-cols-2 gap-2.5 pt-1 animate-in fade-in duration-200">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-slate-500">Từ ngày</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#1F7A8C]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-slate-500">Đến ngày</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#1F7A8C]"
                />
              </div>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 flex flex-col gap-0.5 mt-0.5">
            <span className="text-xs font-bold text-[#1F7A8C]">
              {durationInfo.label}
            </span>
            <span className="text-[11px] text-slate-600">
              {durationInfo.subtext}
            </span>
          </div>
        </div>

        {/* 4. Cách dùng & Thời điểm */}
        <Input
          label="Cách dùng & Thời điểm"
          placeholder="Ví dụ: 1 viên · sau ăn sáng"
          value={timingInstructions}
          onChange={(e) => setTimingInstructions(e.target.value)}
          required
        />

        {/* 5. Nút bấm thao tác */}
        <div className="flex gap-2 pt-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Huỷ
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {isEdit ? 'Lưu thay đổi' : 'Lưu thuốc'}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
