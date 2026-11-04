import React from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { CareTaskItem } from '../useChronicLogic';

interface NextTasksCardProps {
  readonly tasks: readonly CareTaskItem[];
  readonly onToggleTask: (taskId: string) => void;
  readonly nextCheckupDate?: string;
}

function formatDayMonth(dateStr?: string): string {
  if (!dateStr) return '12/11';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '12/11';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  } catch {
    return '12/11';
  }
}

export const NextTasksCard: React.FC<NextTasksCardProps> = ({
  tasks,
  onToggleTask,
  nextCheckupDate,
}) => {
  const displayTasks =
    tasks.length > 0
      ? tasks
      : [
          { id: '1', title: 'Theo dõi huyết áp sáng và tối', is_completed: false },
          { id: '2', title: 'Xét nghiệm lipid máu trước tái khám', is_completed: false },
        ];

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-xs flex flex-col gap-3.5">
      <h3 className="text-base font-extrabold text-slate-900 leading-tight">
        Việc cần làm tiếp theo
      </h3>

      {/* Task list */}
      <div className="flex flex-col gap-2.5">
        {displayTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                task.is_completed
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'border-slate-300 bg-white group-hover:border-slate-400'
              }`}
            >
              {task.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span
              className={`text-xs font-semibold leading-relaxed ${
                task.is_completed ? 'line-through text-slate-400' : 'text-slate-800'
              }`}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>

      {/* Revisit button */}
      <button
        onClick={() => alert('Chuyển tới cổng đặt lịch khám trực tuyến CSYT')}
        className="w-full h-11 rounded-2xl bg-slate-100 hover:bg-slate-200/80 active:scale-98 transition text-slate-800 text-xs font-extrabold flex items-center justify-between px-3.5 mt-1"
      >
        <span>Đặt lịch tái khám {formatDayMonth(nextCheckupDate)}</span>
        <ChevronRight className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  );
};
