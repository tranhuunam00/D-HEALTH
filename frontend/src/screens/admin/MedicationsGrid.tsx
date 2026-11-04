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
      <div className="p-8 text-center text-slate-500 text-xs">
        Không có dữ liệu dược thư nào.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
          <tr>
            <th className="px-4 py-3">Tên Thương Mại</th>
            <th className="px-4 py-3">Hoạt Chất (Generic)</th>
            <th className="px-4 py-3">Hàm Lượng</th>
            <th className="px-4 py-3">Dạng Bào Chế</th>
            <th className="px-4 py-3">Đường Dùng</th>
            <th className="px-4 py-3">Trạng Thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {medications.map((m) => (
            <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3 font-semibold text-white">{m.brand_name}</td>
              <td className="px-4 py-3 text-cyan-400 font-mono text-[11px]">{m.generic_name}</td>
              <td className="px-4 py-3 font-semibold text-amber-300">{m.strength}</td>
              <td className="px-4 py-3 text-slate-400">{m.dosage_form}</td>
              <td className="px-4 py-3">{m.route}</td>
              <td className="px-4 py-3">
                {m.is_active ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">
                    Khả dụng
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-semibold">
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
