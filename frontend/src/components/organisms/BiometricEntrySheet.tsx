import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { ManualVitalsInput } from '../../types/biometric.types';

export interface BiometricEntrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ManualVitalsInput) => void;
}

export const BiometricEntrySheet: React.FC<BiometricEntrySheetProps> = ({ isOpen, onClose, onSubmit }) => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [spo2, setSpo2] = useState('');
  const [glucose, setGlucose] = useState('');
  const [temperature, setTemperature] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      systolic: systolic ? parseInt(systolic, 10) : undefined,
      diastolic: diastolic ? parseInt(diastolic, 10) : undefined,
      heartRate: heartRate ? parseInt(heartRate, 10) : undefined,
      spo2: spo2 ? parseInt(spo2, 10) : undefined,
      glucose: glucose ? parseFloat(glucose) : undefined,
      temperature: temperature ? parseFloat(temperature) : undefined,
    });
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Ghi Nhận Chỉ Số Nhanh">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Huyết áp tâm thu (mmHg)"
            placeholder="120"
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
          />
          <Input
            label="Huyết áp tâm trương (mmHg)"
            placeholder="80"
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nhịp tim (BPM)"
            placeholder="75"
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
          />
          <Input
            label="Độ bão hòa oxy SpO2 (%)"
            placeholder="98"
            type="number"
            value={spo2}
            onChange={(e) => setSpo2(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nhiệt độ cơ thể (°C)"
            placeholder="36.7"
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
          <Input
            label="Đường huyết mao mạch (mmol/L)"
            placeholder="5.6"
            type="number"
            step="0.1"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Hủy
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Lưu Chỉ Số
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
