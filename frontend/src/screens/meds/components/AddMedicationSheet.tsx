import React, { useState } from 'react';
import { BottomSheet } from '../../../components/organisms/BottomSheet';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';

interface AddMedicationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    medicationName: string;
    dosage: string;
    timingInstructions: string;
    scheduledTime: string;
  }) => void;
}

export const AddMedicationSheet: React.FC<AddMedicationSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('500 mg');
  const [timingInstructions, setTimingInstructions] = useState('1 viên · sau ăn');
  const [scheduledTime, setScheduledTime] = useState('08:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationName) return;
    onSubmit({
      medicationName,
      dosage,
      timingInstructions,
      scheduledTime: `${scheduledTime}:00`,
    });
    setMedicationName('');
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Thêm thuốc vào lịch nhắc">
      <form onSubmit={handleSubmit} className="space-y-3.5 pb-2">
        <Input
          label="Tên thuốc"
          placeholder="Ví dụ: Metformin, Losartan"
          value={medicationName}
          onChange={(e) => setMedicationName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Hàm lượng"
            placeholder="Ví dụ: 500 mg"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
          <Input
            label="Giờ uống"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
        </div>

        <Input
          label="Cách dùng & Thời điểm"
          placeholder="Ví dụ: 1 viên · sau ăn sáng"
          value={timingInstructions}
          onChange={(e) => setTimingInstructions(e.target.value)}
          required
        />

        <div className="flex gap-2 pt-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Hủy
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Lưu thuốc
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
