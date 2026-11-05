import React, { useState } from 'react';
import { Calendar, Clock, Stethoscope, Building2 } from 'lucide-react';
import { BottomSheet } from '../../../components/organisms/BottomSheet';
import { CareTeamMember } from '../useCareLogic';

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

const TIME_SLOTS = ['08:30', '09:00', '09:30', '10:00', '14:00', '14:30', '15:00', '15:30'];

export const ScheduleAppointmentSheet: React.FC<ScheduleAppointmentSheetProps> = ({
  isOpen,
  onClose,
  doctors,
  onSchedule,
}) => {
  const activeDoctors = doctors.filter((d) => d.code !== 'GD');
  const defaultDoc = activeDoctors[0];

  const [selectedDoctorId, setSelectedDoctorId] = useState(defaultDoc?.id || '');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('09:00');
  const [purpose, setPurpose] = useState('Tái khám định kỳ theo dõi chỉ số');
  const [loading, setLoading] = useState(false);

  const selectedDoctor = activeDoctors.find((d) => d.id === selectedDoctorId) || defaultDoc;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const appointmentDate = `${date}T${time}:00.000Z`;
    const success = await onSchedule({
      doctorId: selectedDoctor?.granteeId || selectedDoctor?.id || '',
      doctorName: selectedDoctor?.name || 'Bác sĩ phụ trách',
      facilityName: selectedDoctor?.org || 'Bệnh viện đối tác',
      departmentName: selectedDoctor?.role || 'Khám chuyên khoa',
      appointmentDate,
      purpose,
    });
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Đặt & Đổi Lịch Tái Khám">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-800">
        {/* 1. Chọn Bác sĩ phụ trách */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Bác sĩ phụ trách khám
          </label>
          <div className="flex flex-col gap-2">
            {activeDoctors.map((doc) => {
              const isSelected = (selectedDoctorId || defaultDoc?.id) === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctorId(doc.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-50/60 border-[#1F7A8C] shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-[#1F7A8C]">
                      {doc.code}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] text-slate-500">{doc.role} · {doc.org}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1F7A8C]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Chọn Ngày Khám */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Ngày hẹn khám
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
        </div>

        {/* 3. Khung Giờ Khám */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Khung giờ khám (Giờ Việt Nam)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
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
            disabled={loading}
            className="flex-1 py-3 bg-[#1F7A8C] hover:bg-[#165B69] text-white font-extrabold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Xác Nhận Lịch Hẹn'}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};
