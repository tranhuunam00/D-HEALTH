import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Stethoscope, Building2, Search, CheckCircle2, User } from 'lucide-react';
import { BottomSheet } from '../../../components/organisms/BottomSheet';
import { CareTeamMember } from '../useCareLogic';
import { APPOINTMENT_TIME_SLOTS, CARE_DEFAULT_CONFIG } from '../care.constants';

export interface DoctorOption {
  id: string;
  name: string;
  code: string;
  role: string;
  org: string;
  phone?: string;
  email?: string;
}

interface ScheduleAppointmentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: CareTeamMember[];
  onSchedule: (data: {
    doctorId: string;
    doctorName: string;
    facilityName: string;
    departmentName: string;
    appointmentDate: string;
    purpose: string;
  }) => Promise<boolean>;
}

function getInitials(name: string): string {
  if (!name) return CARE_DEFAULT_CONFIG.fallbackDoctorCode;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const ScheduleAppointmentSheet: React.FC<ScheduleAppointmentSheetProps> = ({
  isOpen,
  onClose,
  doctors: propDoctors,
  onSchedule,
}) => {
  const [adminDoctors, setAdminDoctors] = useState<DoctorOption[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('09:00');
  const [purpose, setPurpose] = useState('Tái khám định kỳ theo dõi chỉ số');
  const [submitting, setSubmitting] = useState(false);

  // Fetch danh sách bác sĩ từ hệ thống (do Admin quản lý trong master_doctors)
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchDoctors = async () => {
      setLoadingDocs(true);
      try {
        const baseUrl =
          typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
            ? window.location.origin
            : 'http://localhost';
        const res = await fetch(`${baseUrl}/api/doctors`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && Array.isArray(json?.data) && json.data.length > 0) {
            const mapped: DoctorOption[] = json.data.map((d: any) => {
              const title = d.academic_title ? `${d.academic_title} ` : '';
              const fullName = `${title}${d.full_name || 'Bác sĩ'}`.trim();
              return {
                id: d.id,
                name: fullName,
                code: getInitials(d.full_name || 'BS'),
                role: d.department_name || d.specialty || 'Khám chuyên khoa',
                org: d.facility_name || 'Bệnh viện đối tác',
                phone: d.phone_number,
                email: d.email,
              };
            });
            setAdminDoctors(mapped);
          }
        }
      } catch (err) {
        console.error('Lỗi tải danh sách bác sĩ:', err);
      } finally {
        if (isMounted) setLoadingDocs(false);
      }
    };

    fetchDoctors();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Hợp nhất danh sách: Ưu tiên danh sách bác sĩ Admin tạo, kèm careTeam nếu có
  const availableDoctors = useMemo(() => {
    if (adminDoctors.length > 0) return adminDoctors;

    // Fallback sang careTeam nếu chưa load được admin doctors
    return propDoctors
      .filter((d) => d.code !== 'GD')
      .map((d) => ({
        id: d.granteeId || d.id,
        name: d.name,
        code: d.code || getInitials(d.name),
        role: d.role,
        org: d.org || 'Bệnh viện đối tác',
        phone: d.phone,
        email: d.email,
      }));
  }, [adminDoctors, propDoctors]);

  // Tự động chọn bác sĩ đầu tiên khi có danh sách
  useEffect(() => {
    if (availableDoctors.length > 0) {
      const exists = availableDoctors.some((d) => d.id === selectedDoctorId);
      if (!exists) {
        setSelectedDoctorId(availableDoctors[0].id);
      }
    }
  }, [availableDoctors, selectedDoctorId]);

  // Lọc theo từ khóa tìm kiếm
  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return availableDoctors;
    const q = searchQuery.toLowerCase().trim();
    return availableDoctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.role.toLowerCase().includes(q) ||
        d.org.toLowerCase().includes(q)
    );
  }, [availableDoctors, searchQuery]);

  const selectedDoctor = useMemo(() => {
    return availableDoctors.find((d) => d.id === selectedDoctorId) || availableDoctors[0];
  }, [availableDoctors, selectedDoctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const appointmentDate = `${date}T${time}:00.000Z`;
    const success = await onSchedule({
      doctorId: selectedDoctor?.id || '',
      doctorName: selectedDoctor?.name || 'Bác sĩ phụ trách',
      facilityName: selectedDoctor?.org || 'Bệnh viện đối tác',
      departmentName: selectedDoctor?.role || 'Khám chuyên khoa',
      appointmentDate,
      purpose,
    });
    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Đặt & Đổi Lịch Tái Khám">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-800">
        {/* 1. Chọn Bác sĩ phụ trách (Từ danh bạ Admin tạo) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#1F7A8C]" />
              <span>Bác sĩ phụ trách khám</span>
            </label>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {availableDoctors.length} bác sĩ trong hệ thống
            </span>
          </div>

          {/* Ô tìm kiếm nhanh bác sĩ */}
          {availableDoctors.length > 3 && (
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, khoa hoặc bệnh viện..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/30 focus:bg-white"
              />
            </div>
          )}

          {/* Danh sách thẻ bác sĩ dạng cuộn */}
          <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
            {loadingDocs ? (
              <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1F7A8C] border-t-transparent rounded-full animate-spin" />
                <span>Đang tải danh sách bác sĩ...</span>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                {availableDoctors.length === 0
                  ? 'Chưa có bác sĩ nào trong hệ thống. Vui lòng thêm bác sĩ tại trang Quản trị.'
                  : 'Không tìm thấy bác sĩ phù hợp với từ khóa.'}
              </div>
            ) : (
              filteredDoctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-50/70 border-[#1F7A8C] shadow-2xs ring-1 ring-[#1F7A8C]/40'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-[#1F7A8C] text-white shadow-xs'
                            : 'bg-teal-100 text-[#1F7A8C]'
                        }`}
                      >
                        {doc.code}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <span>{doc.role}</span>
                          <span>·</span>
                          <span className="text-slate-600 font-medium">{doc.org}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#1F7A8C]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 2. Chọn Ngày Khám */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#1F7A8C]" />
            <span>Ngày hẹn khám</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/30"
              required
            />
          </div>
          {date && (
            <p className="text-[11px] font-bold text-[#1F7A8C] mt-1">
              📅 Ngày khám:{' '}
              {(() => {
                const parts = date.split('-');
                if (parts.length === 3) {
                  const [y, m, d] = parts;
                  const dt = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
                  const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
                  const wd = !isNaN(dt.getTime()) ? weekdays[dt.getDay()] : '';
                  return `${wd ? wd + ', ' : ''}ngày ${d} tháng ${m} năm ${y}`;
                }
                return date;
              })()}
            </p>
          )}
        </div>

        {/* 3. Khung Giờ Khám */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#1F7A8C]" />
            <span>Khung giờ khám (Giờ Việt Nam)</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {APPOINTMENT_TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  time === slot
                    ? 'bg-[#1F7A8C] border-[#1F7A8C] text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Mục Đích Tái Khám */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Mục đích tái khám
          </label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="VD: Tái khám tim mạch, kiểm tra đường huyết..."
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/30"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting || availableDoctors.length === 0}
            className="flex-1 py-3 bg-[#1F7A8C] hover:bg-[#165B69] text-white font-extrabold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : 'Xác Nhận Lịch Hẹn'}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};
