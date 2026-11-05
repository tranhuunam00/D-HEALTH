import React from 'react';
import { Calendar, Clock, MapPin, Stethoscope, User, Phone } from 'lucide-react';

export interface AdminAppointmentItem {
  id: string;
  member_id: string;
  patient_name?: string;
  patient_phone?: string;
  patient_email?: string;
  doctor_id?: string;
  doctor_name: string;
  department_name?: string;
  facility_name?: string;
  appointment_date: string;
  purpose: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface AppointmentsGridProps {
  appointments: AdminAppointmentItem[];
  loading?: boolean;
}

export const AppointmentsGrid: React.FC<AppointmentsGridProps> = ({ appointments, loading }) => {
  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return { time, date };
    } catch {
      return { time: '--:--', date: dateStr };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 whitespace-nowrap">
            Hoàn thành
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold border border-slate-200 whitespace-nowrap">
            Đã hủy
          </span>
        );
      case 'scheduled':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-teal-50 text-[#1F7A8C] font-bold border border-teal-200 whitespace-nowrap">
            Đã lên lịch
          </span>
        );
    }
  };

  return (
    <div>
      {/* Header Bar */}
      <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#1F7A8C]" />
          <span className="text-xs text-slate-600 font-medium">
            Tổng cộng: <strong className="text-slate-900 font-bold">{appointments.length}</strong> lịch hẹn khám đã đặt
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-xs">Đang tải danh sách lịch hẹn...</div>
      ) : appointments.length === 0 ? (
        <div className="p-10 text-center text-slate-400 text-xs">
          Chưa có lịch hẹn khám nào được đặt trong hệ thống.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Bệnh Nhân</th>
                <th className="px-4 py-3">Bác Sĩ Phụ Trách</th>
                <th className="px-4 py-3">Thời Gian Khám</th>
                <th className="px-4 py-3">Cơ Sở Y Tế</th>
                <th className="px-4 py-3">Mục Đích Khám</th>
                <th className="px-4 py-3">Trạng Thái</th>
                <th className="px-4 py-3">Ngày Đặt Lịch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((appt) => {
                const { time, date } = formatDateTime(appt.appointment_date);
                const bookedAt = new Date(appt.created_at).toLocaleDateString('vi-VN');

                return (
                  <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-teal-50 text-[#1F7A8C] font-bold text-xs flex items-center justify-center border border-teal-100">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{appt.patient_name || appt.member_id}</div>
                          {appt.patient_phone && appt.patient_phone !== '--' && (
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{appt.patient_phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                        <Stethoscope className="w-3.5 h-3.5 text-[#1F7A8C]" />
                        <span>{appt.doctor_name}</span>
                      </div>
                      <div className="text-[10px] text-purple-700 font-semibold pl-5">
                        {appt.department_name}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono">
                      <div className="text-teal-700 font-bold text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>{time}</span>
                      </div>
                      <div className="text-slate-600 text-[11px] pl-4.5">{date}</div>
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{appt.facility_name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-800">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                        {appt.purpose || 'Tái khám định kỳ'}
                      </span>
                    </td>

                    <td className="px-4 py-3">{getStatusBadge(appt.status)}</td>

                    <td className="px-4 py-3 text-[11px] font-mono text-slate-400 whitespace-nowrap">
                      {bookedAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
