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
    <div className="flex gap-1.5 shrink-0 w-full" role="tablist">
      {HEALTH_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectTab(tab.id)}
            className={`flex-1 h-9 px-2 rounded-[18px] justify-center whitespace-nowrap text-xs font-semibold flex items-center transition-all ${
              isActive
                ? 'bg-[#111827] text-white font-bold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
