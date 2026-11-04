import React, { useState } from 'react';
import { BottomSheet } from '../../../components/organisms/BottomSheet';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';

interface AddDoctorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    doctorName: string;
    specialty: string;
    hospital: string;
    phone: string;
    email: string;
  }) => void;
}

export const AddDoctorSheet: React.FC<AddDoctorSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('Tim mạch');
  const [hospital, setHospital] = useState('Bệnh viện đối tác');
  const [phone, setPhone] = useState('0912 345 678');
  const [email, setEmail] = useState('bacsi@dhealth.vn');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName) return;
    onSubmit({
      doctorName,
      specialty,
      hospital,
      phone,
      email,
    });
    setDoctorName('');
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Thêm Bác Sĩ Vào Care Team">
      <form onSubmit={handleSubmit} className="space-y-3.5 pb-2">
        <Input
          label="Tên bác sĩ"
          placeholder="Ví dụ: BS Nguyễn Văn An"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Chuyên khoa"
            placeholder="Ví dụ: Tim mạch"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
          />
          <Input
            label="Cơ sở y tế"
            placeholder="Ví dụ: Bệnh viện Bạch Mai"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Số điện thoại"
            placeholder="0912 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Email liên hệ"
            placeholder="bacsi@dhealth.vn"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Hủy
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Thêm bác sĩ
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
