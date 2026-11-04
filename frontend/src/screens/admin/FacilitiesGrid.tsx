import React from 'react';

export interface FacilityItem {
  id: string;
  code: string;
  name: string;
  facility_type: string;
  city: string;
  hotline: string;
  is_active: boolean;
}

interface FacilitiesGridProps {
  facilities: FacilityItem[];
}

export const FacilitiesGrid: React.FC<FacilitiesGridProps> = ({ facilities }) => {
  if (facilities.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        Không có dữ liệu cơ sở y tế nào.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
          <tr>
            <th className="px-4 py-3">Mã Định Danh</th>
            <th className="px-4 py-3">Tên Cơ Sở Y Tế</th>
            <th className="px-4 py-3">Phân Loại</th>
            <th className="px-4 py-3">Thành Phố</th>
            <th className="px-4 py-3">Hotline</th>
            <th className="px-4 py-3">Trạng Thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {facilities.map((f) => (
            <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3 font-mono text-purple-400 font-semibold">{f.code}</td>
              <td className="px-4 py-3 font-semibold text-white">{f.name}</td>
              <td className="px-4 py-3 text-slate-400 capitalize">{f.facility_type.replace('_', ' ')}</td>
              <td className="px-4 py-3">{f.city}</td>
              <td className="px-4 py-3 font-mono">{f.hotline}</td>
              <td className="px-4 py-3">
                {f.is_active ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">
                    Hoạt động
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-semibold">
                    Tạm dừng
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
