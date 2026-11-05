import React from 'react';
import { Edit3, Link2, Camera } from 'lucide-react';
import { ClsKind, InputMethod } from '../camera-input.types';

export interface CameraTypeAndMethodTabsProps {
  kind: ClsKind;
  method: InputMethod;
  onSetKind: (kind: ClsKind) => void;
  onSetMethod: (method: InputMethod) => void;
}

export const CameraTypeAndMethodTabs: React.FC<CameraTypeAndMethodTabsProps> = ({
  kind,
  method,
  onSetKind,
  onSetMethod,
}) => {
  return (
    <>
      {/* LOẠI KẾT QUẢ */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          LOẠI KẾT QUẢ
        </span>
        <div className="grid grid-cols-2 gap-1.5 bg-slate-200/80 p-1 rounded-2xl" role="tablist">
          {[
            { id: 'lab', label: 'Xét nghiệm' },
            { id: 'img', label: 'CĐHA' },
          ].map((k) => (
            <button
              key={k.id}
              role="tab"
              aria-selected={kind === k.id}
              onClick={() => onSetKind(k.id as ClsKind)}
              className={`h-11 min-h-[44px] rounded-xl text-xs font-extrabold transition ${
                kind === k.id ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-slate-500 px-1">
          CĐHA: chẩn đoán hình ảnh (X-quang, Siêu âm, CT, MRI, Nhũ ảnh)
        </span>
      </div>

      {/* CÁCH NHẬP */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          CÁCH NHẬP
        </span>
        <div className="grid grid-cols-3 gap-2" role="tablist">
          {[
            { id: 'manual', label: 'Nhập thủ công', icon: Edit3, badge: '' },
            { id: 'link', label: 'Từ link CSYT', icon: Link2, badge: 'Sắp ra mắt' },
            { id: 'cam', label: 'AI Camera', icon: Camera, badge: 'Sắp ra mắt' },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = method === m.id;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSetMethod(m.id as InputMethod)}
                className={`relative h-20 min-h-[56px] rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-extrabold transition p-2 active:scale-95 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-transparent bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
                }`}
              >
                {m.badge && (
                  <span
                    className={`absolute -top-1.5 px-1.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-tight shadow-xs ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {m.badge}
                  </span>
                )}
                <Icon className="w-5 h-5 shrink-0" />
                <span className="leading-tight text-center">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

