import React, { useState } from 'react';
import { BottomSheet } from '../../../components/organisms/BottomSheet';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';

interface AddTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

const COMMON_TASKS = [
  'Đo huyết áp sáng và tối',
  'Xét nghiệm lipid máu trước tái khám',
  'Đo đường huyết lúc đói',
  'Uống thuốc đúng giờ theo đơn',
  'Tái khám định kỳ theo lịch hẹn',
  'Tập thể dục 30 phút mỗi ngày',
];

export const AddTaskSheet: React.FC<AddTaskSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim());
    setTitle('');
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Thêm Việc Cần Làm">
      <form onSubmit={handleSubmit} className="space-y-3 pb-2">
        <Input
          label="Nội dung việc cần làm"
          placeholder="Ví dụ: Đo huyết áp sáng và tối..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-500">Gợi ý việc cần làm phổ biến:</span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_TASKS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTitle(t)}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Huỷ
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Thêm việc này
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};

