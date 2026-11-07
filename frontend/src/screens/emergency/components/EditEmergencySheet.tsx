import React, { useState, useEffect } from 'react';
import { Plus, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BottomSheet } from '../../../components/organisms/BottomSheet';
import { EmergencyCardData } from '../useEmergencyLogic';

interface EditEmergencySheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: EmergencyCardData | null;
  onSave: (payload: {
    bloodType: string;
    allergies: string[];
    emergencyNotes: string;
    contacts: Array<{ name: string; relationship: string; phone: string }>;
  }) => Promise<boolean>;
}

const COMMON_ALLERGENS = [
  'Penicillin',
  'Aspirin / NSAIDs',
  'Hải sản (Tôm, Cua)',
  'Đậu phộng',
  'Phấn hoa',
  'Sữa bò',
  'Trứng gà',
];

export const EditEmergencySheet: React.FC<EditEmergencySheetProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [bloodType, setBloodType] = useState(initialData?.bloodType || 'B+');
  const [allergies, setAllergies] = useState<string[]>(initialData?.rawAllergies || []);
  const [customAllergy, setCustomAllergy] = useState('');
  const [contactName, setContactName] = useState(initialData?.emergencyContact?.name || '');
  const [contactRel, setContactRel] = useState(initialData?.emergencyContact?.relationship || 'Người thân');
  const [contactPhone, setContactPhone] = useState(initialData?.emergencyContact?.phone || '');
  const [notes, setNotes] = useState(initialData?.emergencyNotes || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setBloodType(initialData.bloodType || 'B+');
      setAllergies(initialData.rawAllergies || []);
      setContactName(initialData.emergencyContact?.name || '');
      setContactRel(initialData.emergencyContact?.relationship || 'Người thân');
      setContactPhone(initialData.emergencyContact?.phone || '');
      setNotes(initialData.emergencyNotes || '');
    }
  }, [initialData]);

  const handleAddAllergy = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies([...allergies, trimmed]);
      setCustomAllergy('');
    }
  };

  const handleRemoveAllergy = (name: string) => {
    setAllergies(allergies.filter((a) => a !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const success = await onSave({
      bloodType,
      allergies,
      emergencyNotes: notes,
      contacts: [
        {
          name: contactName || 'Người thân',
          relationship: contactRel || 'Liên hệ',
          phone: contactPhone || '115',
        },
      ],
    });
    setSaving(false);
    if (success) {
      onClose();
    } else {
      alert('Không thể lưu thẻ cấp cứu. Vui lòng thử lại.');
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Cập Nhật Thẻ Cấp Cứu & Dị Ứng">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-800">
        {/* 1. Nhóm Máu */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Nhóm máu sinh trắc học
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bt) => (
              <button
                key={bt}
                type="button"
                onClick={() => setBloodType(bt)}
                className={`py-2 text-xs font-black rounded-xl border transition ${
                  bloodType === bt
                    ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {bt}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Dị Ứng Nguy Hiểm */}
        <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Dị ứng thuốc & Thực phẩm nguy hiểm ({allergies.length})</span>
          </div>

          {/* Tag list */}
          <div className="flex flex-wrap gap-1.5 min-h-[32px]">
            {allergies.length === 0 ? (
              <span className="text-[11px] text-slate-400 italic">Chưa ghi nhận dị ứng nào</span>
            ) : (
              allergies.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-rose-200 text-rose-800 rounded-full text-xs font-bold shadow-2xs"
                >
                  {a}
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(a)}
                    className="hover:text-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1 pt-1">
            <span className="text-[10px] text-slate-400 font-semibold self-center mr-1">Gợi ý nhanh:</span>
            {COMMON_ALLERGENS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleAddAllergy(item)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition ${
                  allergies.includes(item)
                    ? 'bg-rose-100 border-rose-300 text-rose-700 opacity-60'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                }`}
              >
                + {item}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex gap-1.5 mt-1">
            <input
              type="text"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              placeholder="Nhập dị ứng khác..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAllergy(customAllergy);
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleAddAllergy(customAllergy)}
              className="px-3 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition"
            >
              Thêm
            </button>
          </div>
        </div>

        {/* 3. Người Liên Hệ Khẩn Cấp */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-2.5">
          <span className="text-xs font-bold text-slate-800">Người liên hệ khẩn cấp (SOS Contact)</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Họ và tên</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Mối quan hệ</label>
              <input
                type="text"
                value={contactRel}
                onChange={(e) => setContactRel(e.target.value)}
                placeholder="VD: Vợ / Chồng / Bố / Mẹ"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 block mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="VD: 0912345678"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
        </div>

        {/* 4. Ghi Chú Y Tế */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Ghi chú y tế khẩn cấp khác
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="VD: Có van tim nhân tạo, tiền sử sốc phản vệ..."
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-[#1F7A8C] hover:bg-[#165B69] text-white font-extrabold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Lưu Thẻ Cấp Cứu'}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

