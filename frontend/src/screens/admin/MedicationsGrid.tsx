import React from 'react';

export interface MedicationItem {
  id: string;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  route: string;
  is_active: boolean;
}

interface MedicationsGridProps {
  medications: MedicationItem[];
}

export const MedicationsGrid: React.FC<MedicationsGridProps> = ({ medications }) => {
  if (medications.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Không có dữ liệu dược thư nào.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-700">
        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
          <tr>
            <th className="px-4 py-3">Tên Thương Mại</th>
            <th className="px-4 py-3">Hoạt Chất (Generic)</th>
            <th className="px-4 py-3">Hàm Lượng</th>
            <th className="px-4 py-3">Dạng Bào Chế</th>
            <th className="px-4 py-3">Đường Dùng</th>
            <th className="px-4 py-3">Trạng Thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {medications.map((m) => (
            <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-4 py-3 font-semibold text-slate-900">{m.brand_name}</td>
              <td className="px-4 py-3 text-[#1F7A8C] font-mono text-[11px] font-bold">{m.generic_name}</td>
              <td className="px-4 py-3 font-semibold text-amber-700">{m.strength}</td>
              <td className="px-4 py-3 text-slate-600">{m.dosage_form}</td>
              <td className="px-4 py-3 text-slate-700">{m.route}</td>
              <td className="px-4 py-3">
                {m.is_active ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Khả dụng
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-700 font-bold border border-rose-200">
                    Ngừng lưu hành
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
