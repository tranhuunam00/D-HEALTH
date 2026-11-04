import React from 'react';

export interface CameraCommonManualFormProps {
  testDate: string;
  doctorName: string;
  facilityName: string;
  onTestDateChange: (date: string) => void;
  onDoctorNameChange: (name: string) => void;
  onFacilityNameChange: (facility: string) => void;
}

export const CameraCommonManualForm: React.FC<CameraCommonManualFormProps> = ({
  testDate,
  doctorName,
  facilityName,
  onTestDateChange,
  onDoctorNameChange,
  onFacilityNameChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Ngày thực hiện *</label>
          <input
            type="date"
            value={testDate}
            onChange={(e) => onTestDateChange(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Bác sĩ thực hiện</label>
          <input
            value={doctorName}
            onChange={(e) => onDoctorNameChange(e.target.value)}
            placeholder="Họ tên bác sĩ"
            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="text-slate-500 text-xs font-bold block mb-1">Cơ sở thực hiện</label>
        <input
          value={facilityName}
          onChange={(e) => onFacilityNameChange(e.target.value)}
          placeholder="Tên bệnh viện / phòng khám"
          className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none"
        />
      </div>
    </div>
  );
};

