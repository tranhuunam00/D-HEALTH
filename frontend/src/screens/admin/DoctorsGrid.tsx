import React from 'react';

export interface DoctorItem {
  id: string;
  full_name: string;
  academic_title?: string;
  specialty: string;
  department_name?: string;
  facility_name?: string;
  license_no: string;
  is_active: boolean;
}

interface DoctorsGridProps {
  doctors: DoctorItem[];
}

export const DoctorsGrid: React.FC<DoctorsGridProps> = ({ doctors }) => {
  if (doctors.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        Không có dữ liệu bác sĩ nào.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
          <tr>
            <th className="px-4 py-3">Bác Sĩ</th>
            <th className="px-4 py-3">Chuyên Khoa</th>
            <th className="px-4 py-3">Khoa / Phòng</th>
            <th className="px-4 py-3">Cơ Sở Y Tế</th>
            <th className="px-4 py-3">Số Giấy Phép (CCHN)</th>
            <th className="px-4 py-3">Trạng Thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {doctors.map((d) => (
            <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3 font-semibold text-white">
                <div className="font-bold">{d.full_name}</div>
                {d.academic_title && (
                  <div className="text-[10px] text-purple-400">{d.academic_title}</div>
                )}
              </td>
              <td className="px-4 py-3 text-emerald-400 font-medium">{d.specialty}</td>
              <td className="px-4 py-3 text-slate-400">{d.department_name || '--'}</td>
              <td className="px-4 py-3 text-slate-300">{d.facility_name || '--'}</td>
              <td className="px-4 py-3 font-mono text-slate-400">{d.license_no}</td>
              <td className="px-4 py-3">
                {d.is_active ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">
                    Đang công tác
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-semibold">
                    Nghỉ phép
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
