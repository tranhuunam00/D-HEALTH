import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export interface FacilityItem {
  id: string;
  code: string;
  name: string;
  facility_type: string;
  city: string;
  hotline: string;
  emergency_phone?: string;
  address?: string;
  is_active: boolean;
}

interface FacilitiesGridProps {
  facilities: FacilityItem[];
  onAdd?: () => void;
  onEdit?: (facility: FacilityItem) => void;
  onDelete?: (facility: FacilityItem) => void;
}

export const FacilitiesGrid: React.FC<FacilitiesGridProps> = ({
  facilities,
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
            Tổng cộng: <strong className="text-slate-800">{facilities.length}</strong> cơ sở đối tác
          </span>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="px-3.5 py-1.5 rounded-xl bg-[#1F7A8C] hover:bg-[#186473] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Cơ Sở Y Tế</span>
          </button>
        )}
      </div>

      {facilities.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          Không có dữ liệu cơ sở y tế nào.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Mã Định Danh</th>
                <th className="px-4 py-3">Tên Cơ Sở Y Tế</th>
                <th className="px-4 py-3">Phân Loại</th>
                <th className="px-4 py-3">Thành Phố</th>
                <th className="px-4 py-3">Hotline</th>
                <th className="px-4 py-3">Trạng Thái</th>
                {(onEdit || onDelete) && (
                  <th className="px-4 py-3 text-right">Thao Tác</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facilities.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono text-[#1F7A8C] font-bold">{f.code}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div>{f.name}</div>
                    {f.address && (
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{f.address}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 capitalize">{f.facility_type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-slate-700">{f.city}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{f.hotline}</td>
                  <td className="px-4 py-3">
                    {f.is_active ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-700 font-bold border border-rose-200">
                        Tạm dừng
                      </span>
                    )}
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(f)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#1F7A8C] text-[11px] font-bold inline-flex items-center gap-1 border border-slate-200 transition cursor-pointer"
                          title="Chỉnh sửa CSYT"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Sửa</span>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(f)}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold inline-flex items-center gap-1 border border-rose-200 transition cursor-pointer"
                          title={f.is_active ? 'Ngừng kích hoạt' : 'Xóa'}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{f.is_active ? 'Khóa' : 'Xóa'}</span>
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
