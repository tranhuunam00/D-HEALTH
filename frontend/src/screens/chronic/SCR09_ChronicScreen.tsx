import React from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { HealthCategoryTabs, HealthTabId } from '../../components/molecules/HealthCategoryTabs';
import { HomeBottomNav } from '../home/HomeBottomNav';
import { useChronicLogic } from './useChronicLogic';
import { DynamicConditionCard } from './components/DynamicConditionCard';
import { NextTasksCard } from './components/NextTasksCard';
import { AddChronicConditionSheet } from './components/AddChronicConditionSheet';
import { AddTaskSheet } from './components/AddTaskSheet';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';

interface SCR09Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

export const SCR09_ChronicScreen: React.FC<SCR09Props> = ({
  onNavigate,
  activeMemberName = '',
  activeMemberId = 'mem_145deb71',
}) => {
  const {
    conditions,
    tasks,
    loading,
    isAddConditionOpen,
    setIsAddConditionOpen,
    editingCondition,
    isAddTaskOpen,
    setIsAddTaskOpen,
    successMsg,
    toggleTask,
    handleOpenAddCondition,
    handleOpenEditCondition,
    handleSaveCondition,
    handleDeleteCondition,
    handleAddTask,
    handleDeleteTask,
  } = useChronicLogic(activeMemberId);

  const handleSelectHealthTab = (tab: HealthTabId) => {
    if (tab === 'biometrics') onNavigate('biometrics');
    else if (tab === 'labs') onNavigate('labs');
    else if (tab === 'imaging') onNavigate('imaging');
  };

  const primaryCondition = conditions[0];
  const secondaryConditions = conditions.slice(1);

  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-24">
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-32 flex flex-col gap-3">
        {/* 1. Header Pills */}
        <ScreenHeaderPills
          activeMemberName={activeMemberName}
          onSelectMember={() => onNavigate('family')}
        />

        {/* 2. Tiêu đề Sức khoẻ + Nút Thêm Bệnh Lý */}
        <div className="flex items-center justify-between mt-0.5">
          <h1 className="text-[26px] font-black tracking-tight text-slate-900 leading-none">
            Sức khoẻ
          </h1>
          <button
            type="button"
            onClick={handleOpenAddCondition}
            className="h-8 px-3 rounded-full bg-[#1F7A8C] hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm bệnh lý</span>
          </button>
        </div>

        {/* 3. Category Tabs */}
        <HealthCategoryTabs activeTab="chronic" onSelectTab={handleSelectHealthTab} />

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 4. Loading State hoặc Content */}
        {loading && conditions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Đang tải hồ sơ bệnh mạn tính...
          </div>
        ) : conditions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/60 text-center flex flex-col items-center gap-2.5 shadow-xs">
            <span className="text-sm font-extrabold text-slate-800">
              Chưa có hồ sơ bệnh mạn tính nào
            </span>
            <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed">
              Thêm bệnh lý mạn tính (Tim mạch, Đái tháo đường, Gout, Hen suyễn...) để theo dõi các chỉ số và lịch tái khám.
            </p>
            <button
              type="button"
              onClick={handleOpenAddCondition}
              className="mt-1 px-4 py-2 rounded-full bg-[#1F7A8C] text-white text-xs font-bold shadow-xs active:scale-95 transition"
            >
              + Thêm bệnh mạn tính đầu tiên
            </button>
          </div>
        ) : (
          <>
            {/* 5. Thẻ Bệnh mạn tính chính */}
            {primaryCondition && (
              <DynamicConditionCard
                condition={primaryCondition}
                onEdit={handleOpenEditCondition}
                onDelete={handleDeleteCondition}
              />
            )}

            {/* 6. Thẻ Việc cần làm tiếp theo */}
            <NextTasksCard
              tasks={tasks}
              onToggleTask={toggleTask}
              onAddTask={() => setIsAddTaskOpen(true)}
              onDeleteTask={handleDeleteTask}
              nextCheckupDate={primaryCondition?.next_checkup_date}
            />

            {/* 7. Các thẻ bệnh mạn tính tiếp theo */}
            {secondaryConditions.map((cond) => (
              <DynamicConditionCard
                key={cond.id}
                condition={cond}
                onEdit={handleOpenEditCondition}
                onDelete={handleDeleteCondition}
              />
            ))}

            {/* 8. Nút thêm bệnh lý mới dạng Card viền nét đứt */}
            <button
              type="button"
              onClick={handleOpenAddCondition}
              className="w-full py-4 rounded-3xl border-2 border-dashed border-slate-300 bg-white/60 hover:bg-white text-slate-600 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Plus className="w-4 h-4 text-[#1F7A8C]" />
              <span>+ Thêm bệnh mạn tính cần theo dõi</span>
            </button>
          </>
        )}
      </div>

      {/* Sheet Thêm / Sửa Bệnh Mạn Tính */}
      <AddChronicConditionSheet
        isOpen={isAddConditionOpen}
        initialData={editingCondition}
        onClose={() => setIsAddConditionOpen(false)}
        onSubmit={handleSaveCondition}
      />

      {/* Sheet Thêm Việc Cần Làm */}
      <AddTaskSheet
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSubmit={handleAddTask}
      />

      {/* Bottom Navigation Bar */}
      <HomeBottomNav activeTab="health" onNavigate={onNavigate} />
    </div>
  );
};
