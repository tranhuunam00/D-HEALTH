import React from 'react';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { LabMetricRow, ClassificationCategory, CLASSIFICATION_LABELS } from '../camera-input.types';

interface LabManualSectionProps {
  rows: LabMetricRow[];
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onUpdateRow: (index: number, patch: Partial<LabMetricRow>) => void;
  showCls: boolean;
  sugCode: ClassificationCategory;
  mixed: boolean;
  mixList: string;
  curCode: ClassificationCategory;
  overridden: boolean;
  onSelectCls: (code: ClassificationCategory) => void;
  onResetCls: () => void;
}

export const LabManualSection: React.FC<LabManualSectionProps> = ({
  rows,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  showCls,
  sugCode,
  mixed,
  mixList,
  curCode,
  overridden,
  onSelectCls,
  onResetCls,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* 1. Dynamic Lab Rows Card */}
      <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col gap-2.5">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-extrabold text-slate-900">Chỉ số xét nghiệm</span>
          <span className="text-xs text-slate-500 font-semibold">{rows.length} chỉ số</span>
        </div>

        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-[1.5fr_0.9fr_0.8fr_34px] gap-1.5 items-center">
            <select
              aria-label="Tên chỉ số"
              value={row.name}
              onChange={(e) => onUpdateRow(index, { name: e.target.value })}
              className="h-10 px-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
            >
              <option value="LDL-C">LDL-C</option>
              <option value="HbA1c">HbA1c</option>
              <option value="Glucose đói">Glucose đói</option>
              <option value="Creatinin">Creatinin</option>
              <option value="Hemoglobin (Hb)">Hemoglobin (Hb)</option>
              <option value="Bạch cầu (WBC)">Bạch cầu (WBC)</option>
              <option value="Tiểu cầu (PLT)">Tiểu cầu (PLT)</option>
              <option value="Cấy nước tiểu">Cấy nước tiểu</option>
              <option value="HBV DNA (PCR)">HBV DNA (PCR)</option>
              <option value="Gen CYP2C19">Gen CYP2C19</option>
            </select>

            <input
              aria-label="Giá trị"
              placeholder="Giá trị"
              value={row.value}
              onChange={(e) => onUpdateRow(index, { value: e.target.value })}
              className="h-10 px-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
            />

            <input
              aria-label="Đơn vị"
              placeholder="Đơn vị"
              value={row.unit}
              onChange={(e) => onUpdateRow(index, { unit: e.target.value })}
              className="h-10 px-2 rounded-xl border border-slate-200 text-xs text-slate-500 bg-slate-50 focus:outline-none"
            />

            <button
              type="button"
              aria-label="Xoá chỉ số"
              onClick={() => onRemoveRow(index)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddRow}
          className="h-10 rounded-xl border-1.5 border-dashed border-slate-300 hover:border-slate-400 text-[#1F5F6C] text-xs font-bold flex items-center justify-center gap-1 transition"
        >
          <Plus className="w-4 h-4" /> Thêm chỉ số
        </button>
      </div>

      {/* 2. Classification Suggestion Card (BR-110, BR-111, BR-112, BR-113) */}
      {showCls && (
        <div className={`bg-white rounded-2xl p-3.5 shadow-sm border flex flex-col gap-2.5 transition ${
          overridden ? 'border-amber-300 ring-2 ring-amber-100' : 'border-teal-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900">Đề xuất phân loại</span>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
              overridden ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
            }`}>
              {overridden ? 'Đã chỉnh thủ công' : 'AI đề xuất'}
            </span>
          </div>

          <span className="text-xs text-slate-700">
            AI đề xuất <b>{sugCode} · {CLASSIFICATION_LABELS[sugCode]}</b>
          </span>

          <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="Phân loại xét nghiệm">
            {(Object.keys(CLASSIFICATION_LABELS) as ClassificationCategory[]).map((cat) => {
              const isSelected = curCode === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelectCls(cat)}
                  className={`h-9 rounded-xl text-xs font-black transition ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow'
                      : cat === sugCode
                      ? 'bg-white border-2 border-dashed border-[#1F7A8C] text-slate-800'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-bold text-slate-800">
            Lưu vào nhóm: {curCode} · {CLASSIFICATION_LABELS[curCode]}
          </span>

          {mixed && (
            <div className="bg-amber-50 rounded-xl p-2.5 text-xs text-amber-800 flex items-start gap-1.5 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Phiếu có chỉ số thuộc nhiều nhóm ({mixList}). Nên tách thành phiếu riêng cho từng nhóm.</span>
            </div>
          )}

          {overridden && (
            <div className="flex items-center justify-between gap-2 bg-amber-50 rounded-xl p-2.5 text-xs text-amber-900">
              <span className="flex-1 leading-tight">Bạn đã đổi từ {sugCode} sang {curCode}.</span>
              <button
                type="button"
                onClick={onResetCls}
                className="px-2.5 py-1 rounded-lg border border-amber-600 text-amber-900 font-bold bg-white text-[11px] shrink-0"
              >
                Dùng đề xuất
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
