import React from 'react';
import { User } from 'lucide-react';
import { HealthCategoryTabs, HealthTabId } from '../../components/molecules/HealthCategoryTabs';
import { HomeBottomNav } from '../home/HomeBottomNav';
import { useChronicLogic } from './useChronicLogic';
import { CardioConditionCard } from './components/CardioConditionCard';
import { NextTasksCard } from './components/NextTasksCard';
import { DiabetesConditionCard } from './components/DiabetesConditionCard';

interface SCR09Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

export const SCR09_ChronicScreen: React.FC<SCR09Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
  activeMemberId = 'nam',
}) => {
  const { conditions, tasks, loading, toggleTask } = useChronicLogic(activeMemberId);

  const handleSelectHealthTab = (tab: HealthTabId) => {
    if (tab === 'biometrics') onNavigate('biometrics');
    else if (tab === 'labs') onNavigate('labs');
    else if (tab === 'imaging') onNavigate('imaging');
  };

  const cardioCondition = conditions.find(
    (c) => c.condition_name.includes('Tim') || c.id.includes('tim')
  ) || conditions[0];

  const diabetesCondition = conditions.find(
    (c) => c.condition_name.includes('Đái') || c.id.includes('dai')
  ) || conditions[1];

  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-24">
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 flex flex-col gap-3">
        {/* 1. Header Pills */}
        <div className="flex gap-2 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-2xs">
            <User className="w-3.5 h-3.5 text-slate-300" />
            Hồ sơ sức khoẻ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Tiêu đề Sức khoẻ */}
        <h1 className="text-[26px] font-black tracking-tight text-slate-900 leading-none mt-0.5">
          Sức khoẻ
        </h1>

        {/* 3. Category Tabs */}
        <HealthCategoryTabs activeTab="chronic" onSelectTab={handleSelectHealthTab} />

        {/* 4. Loading State hoặc Content */}
        {loading && conditions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">Đang tải hồ sơ bệnh mạn tính...</div>
        ) : (
          <>
            {/* 5. Thẻ Bệnh mạn tính 1: Tim mạch (Màu đỏ sẫm) */}
            <CardioConditionCard condition={cardioCondition} />

            {/* 6. Thẻ Việc cần làm tiếp theo */}
            <NextTasksCard
              tasks={tasks}
              onToggleTask={toggleTask}
              nextCheckupDate={cardioCondition?.next_checkup_date}
            />

            {/* 7. Thẻ Bệnh mạn tính 2: Đái tháo đường */}
            <DiabetesConditionCard condition={diabetesCondition} />
          </>
        )}
      </div>

      {/* 8. Bottom Navigation Bar */}
      <HomeBottomNav activeTab="health" onNavigate={onNavigate} />
    </div>
  );
};
