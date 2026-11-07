import React from 'react';
import { Plus, X, ChevronDown, AlertTriangle } from 'lucide-react';
import { LabMetricRow, ClassificationCategory, CLASSIFICATION_LABELS } from '../camera-input.types';
import { LAB_CATALOG_GROUPS, LAB_TEST_CATALOG } from '../../../constants/lab-catalog.constants';

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
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-extrabold text-slate-900">Chỉ số xét nghiệm</span>
          <span className="text-xs text-slate-500 font-semibold">{rows.length} chỉ số</span>
        </div>

        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <select
                aria-label="Tên chỉ số"
                value={row.name}
                onChange={(e) => onUpdateRow(index, { name: e.target.value })}
                className="w-full h-11 px-3 pr-7 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none appearance-none"
              >
                {row.name && !LAB_TEST_CATALOG.some((item) => item.name === row.name) && (
                  <option value={row.name}>{row.name}</option>
                )}
                {LAB_CATALOG_GROUPS.map((group) => {
                  const groupItems = LAB_TEST_CATALOG.filter((item) => item.category === group.category);
                  if (groupItems.length === 0) return null;
                  return (
                    <optgroup key={group.category} label={group.label}>
                      {groupItems.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name} {item.unit ? `(${item.unit})` : ''}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
            </div>

            <input
              aria-label="Giá trị"
              placeholder="Giá trị"
              value={row.value}
              onChange={(e) => onUpdateRow(index, { value: e.target.value })}
              className="w-24 h-11 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none shrink-0"
            />

            <div className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
              {row.unit || 'mmol/L'}
            </div>

            {rows.length > 1 && (
              <button
                type="button"
                aria-label="Xoá chỉ số"
                onClick={() => onRemoveRow(index)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={onAddRow}
          className="h-9 text-[#1F7A8C] text-xs font-bold flex items-center gap-1.5 transition hover:opacity-80 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm chỉ số</span>
        </button>
      </div>

      {/* 2. Classification Suggestion Card (Optional detail if overridden or mixed) */}
      {showCls && (mixed || overridden) && (
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

          {mixed && (
            <div className="bg-amber-50 rounded-xl p-2.5 text-xs text-amber-800 flex items-start gap-1.5 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Phiếu có chỉ số thuộc nhiều nhóm ({mixList}). Nên tách thành phiếu riêng cho từng nhóm.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
