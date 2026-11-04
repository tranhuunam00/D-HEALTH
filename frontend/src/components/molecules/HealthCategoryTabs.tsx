import React from 'react';

export type HealthTabId = 'biometrics' | 'labs' | 'imaging' | 'chronic';

interface TabItem {
  readonly id: HealthTabId;
  readonly label: string;
}

const HEALTH_TABS: readonly TabItem[] = Object.freeze([
  { id: 'biometrics', label: 'Sinh trắc' },
  { id: 'labs', label: 'Xét nghiệm' },
  { id: 'imaging', label: 'CĐHA' },
  { id: 'chronic', label: 'Bệnh mạn tính' },
]);

interface HealthCategoryTabsProps {
  readonly activeTab: HealthTabId;
  readonly onSelectTab: (tab: HealthTabId) => void;
}

export const HealthCategoryTabs: React.FC<HealthCategoryTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 shrink-0" role="tablist">
      {HEALTH_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectTab(tab.id)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap shrink-0 text-xs font-semibold flex items-center transition-all ${
              isActive
                ? 'bg-[#111827] text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
