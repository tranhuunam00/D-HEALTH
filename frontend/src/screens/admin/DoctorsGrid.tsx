import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export interface DoctorItem {
  id: string;
  full_name: string;
  academic_title?: string;
  specialty?: string;
  department_id?: string;
  department_name?: string;
  facility_id?: string;
  facility_name?: string;
  license_no?: string;
  license_number?: string;
  phone_number?: string;
  email?: string;
  is_active: boolean;
}

interface DoctorsGridProps {
  doctors: DoctorItem[];
  onAdd?: () => void;
  onEdit?: (doctor: DoctorItem) => void;
  onDelete?: (doctor: DoctorItem) => void;
}

export const DoctorsGrid: React.FC<DoctorsGridProps> = ({
  doctors,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      {/* Header Bar with Action Button (White Theme) */}
      <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Tổng cộng: <strong className="text-slate-800">{doctors.length}</strong> bác sĩ chuyên khoa
          </span>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="px-3.5 py-1.5 rounded-xl bg-[#1F7A8C] hover:bg-[#186473] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Bác Sĩ</span>
          </button>
        )}
      </div>

      {doctors.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          Không có dữ liệu bác sĩ nào.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Bác Sĩ</th>
                <th className="px-4 py-3">Khoa / Chuyên Ngành</th>
                <th className="px-4 py-3">Cơ Sở Y Tế</th>
                <th className="px-4 py-3">Số CCHN</th>
                <th className="px-4 py-3">Liên Hệ</th>
                <th className="px-4 py-3">Trạng Thái</th>
                {(onEdit || onDelete) && (
                  <th className="px-4 py-3 text-right">Thao Tác</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div className="font-bold">{d.full_name}</div>
                    {d.academic_title && (
                      <div className="text-[10px] text-purple-700 font-semibold">{d.academic_title}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[#1F7A8C] font-semibold">
                      {d.department_name || d.specialty || '--'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{d.facility_name || '--'}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{d.license_number || d.license_no || '--'}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {d.phone_number && <div className="font-mono text-[11px] text-slate-800">{d.phone_number}</div>}
                    {d.email && <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{d.email}</div>}
                    {!d.phone_number && !d.email && <span className="text-slate-300">--</span>}
                  </td>
                  <td className="px-4 py-3">
                    {d.is_active ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        Đang công tác
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-700 font-bold border border-rose-200">
                        Nghỉ phép
                      </span>
                    )}
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(d)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#1F7A8C] text-[11px] font-bold inline-flex items-center gap-1 border border-slate-200 transition cursor-pointer"
                          title="Chỉnh sửa bác sĩ"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Sửa</span>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(d)}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold inline-flex items-center gap-1 border border-rose-200 transition cursor-pointer"
                          title={d.is_active ? 'Ngừng kích hoạt' : 'Xóa'}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{d.is_active ? 'Khóa' : 'Xóa'}</span>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
