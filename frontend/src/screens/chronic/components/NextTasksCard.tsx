import React from 'react';
import { ChevronRight, Check, Plus, Trash2 } from 'lucide-react';
import type { CareTaskItem } from '../useChronicLogic';

interface NextTasksCardProps {
  readonly tasks: readonly CareTaskItem[];
  readonly onToggleTask: (taskId: string) => void;
  readonly onAddTask?: () => void;
  readonly onDeleteTask?: (taskId: string) => void;
  readonly nextCheckupDate?: string;
}

function formatDayMonth(dateStr?: string): string {
  if (!dateStr) return 'sắp tới';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  } catch {
    return 'sắp tới';
  }
}

export const NextTasksCard: React.FC<NextTasksCardProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  nextCheckupDate,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-xs flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900 leading-tight">
          Việc cần làm tiếp theo
        </h3>
        <button
          type="button"
          onClick={onAddTask}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm việc</span>
        </button>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2.5">
        {tasks.length === 0 ? (
          <div className="text-xs text-slate-400 py-1 font-medium">
            Không có việc cần làm nào. Nhấn "+ Thêm việc" để ghi chú nhắc nhở.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-2 group"
            >
              <div
                onClick={() => onToggleTask(task.id)}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
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
                  className={`text-xs font-semibold leading-relaxed truncate ${
                    task.is_completed ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {task.title}
                </span>
              </div>

              {onDeleteTask && (
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition"
                  title="Xoá việc này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Revisit button */}
      <button
        type="button"
        onClick={() => alert(`Đặt lịch hẹn tái khám (${formatDayMonth(nextCheckupDate)}) qua cổng CSYT D-Health.`)}
        className="w-full h-11 rounded-2xl bg-slate-100 hover:bg-slate-200/80 active:scale-98 transition text-slate-800 text-xs font-extrabold flex items-center justify-between px-3.5 mt-1"
      >
        <span>Đặt lịch tái khám {formatDayMonth(nextCheckupDate)}</span>
        <ChevronRight className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  );
};
