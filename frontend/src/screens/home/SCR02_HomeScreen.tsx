import React from 'react';
import { Plus } from 'lucide-react';
import { useHomeLogic } from './useHomeLogic';
import { BiometricEntrySheet } from '../../components/organisms/BiometricEntrySheet';
import { HomeBottomNav } from './HomeBottomNav';
import { HomeHeader } from './components/HomeHeader';
import { HomeHealthScoreCard } from './components/HomeHealthScoreCard';
import { HomeMedicationCard } from './components/HomeMedicationCard';
import { HomeVitalsGrid } from './components/HomeVitalsGrid';
import { HomeAiInsightCard } from './components/HomeAiInsightCard';
import { HomeTimelineCard } from './components/HomeTimelineCard';

export interface SCR02Props {
  onOpenEmergency: () => void;
  onNavigate?: (screen: string) => void;
  user?: any;
  activeMemberId?: string;
  activeMemberName?: string;
}

export const SCR02_HomeScreen: React.FC<SCR02Props> = ({
  onOpenEmergency,
  onNavigate,
  user,
  activeMemberId: propMemberId,
  activeMemberName: propMemberName,
}) => {
  const {
    members,
    activeMemberId,
    healthScore,
    latestBp,
    latestHr,
    latestWeight,
    latestGlucose,
    issuesCount,
    dataGroupsCount,
    aiInsight,
    isDoseTaken,
    isVitalsSheetOpen,
    setIsVitalsSheetOpen,
    todayDose,
    todayDosesSummary,
    recentReports,
    handleRecordVitals,
    handleTakeDose,
  } = useHomeLogic(propMemberId || user?.activeMemberId || 'nam', user);

  const activeMember = members.find((m) => m.id === activeMemberId) || {
    id: activeMemberId,
    full_name: propMemberName || user?.fullName || '',
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] pb-24 relative flex flex-col font-sans select-none">
      <div className="flex-1 px-4 pt-4 pb-32 flex flex-col gap-3">
        {/* 1. Header with Avatar & Greeting */}
        <HomeHeader
          fullName={activeMember.full_name}
          onOpenProfile={() => onNavigate?.('profile')}
          onOpenEmergency={onOpenEmergency}
        />

        {/* 2. Health Score Arc Card */}
        <HomeHealthScoreCard
          healthScore={healthScore}
          issuesCount={issuesCount}
          dataGroupsCount={dataGroupsCount}
          onNavigateBiometrics={() => onNavigate?.('biometrics')}
        />

        {/* 3. Next Dose Medication Card */}
        <HomeMedicationCard
          todayDose={todayDose}
          todayDosesSummary={todayDosesSummary}
          isDoseTaken={isDoseTaken}
          onTakeDose={handleTakeDose}
          onNavigateMeds={() => onNavigate?.('meds')}
        />

        {/* 4. 2x2 Vitals Cards */}
        <HomeVitalsGrid
          displayBp={latestBp}
          displayHr={latestHr}
          displayWeight={latestWeight}
          displayGlucose={latestGlucose}
          onNavigateBiometrics={() => onNavigate?.('biometrics')}
          onNavigateLabs={() => onNavigate?.('labs')}
        />

        {/* 5. AI Insight Highlight Card */}
        <HomeAiInsightCard
          insightText={aiInsight}
          onNavigateAi={() => onNavigate?.('ai')}
        />

        {/* 6. Health Timeline */}
        <HomeTimelineCard
          reports={recentReports}
          onNavigateRecords={() => onNavigate?.('records')}
          onNavigateLabs={() => onNavigate?.('labs')}
          onNavigateImaging={() => onNavigate?.('imaging')}
        />
      </div>

      {/* Floating Action Button (+) Nhập số đo */}
      <button
        type="button"
        onClick={() => setIsVitalsSheetOpen(true)}
        className="fixed bottom-20 right-6 w-13 h-13 min-w-[52px] min-h-[52px] rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center shadow-2xl active:scale-90 transition-all z-20"
        title="Nhập số đo nhanh"
        aria-label="Nhập số đo nhanh"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <HomeBottomNav
        activeTab="home"
        onTabChange={(tab) => {
          if (tab === 'home') onNavigate?.('home');
          else if (tab === 'health') onNavigate?.('biometrics');
          else if (tab === 'records') onNavigate?.('records');
          else if (tab === 'ai') onNavigate?.('ai');
          else if (tab === 'care') onNavigate?.('care');
          else if (tab === 'profile') onNavigate?.('profile');
          else if (tab === 'meds') onNavigate?.('meds');
        }}
      />

      {/* Biometric Entry Modal Bottom Sheet */}
      <BiometricEntrySheet
        isOpen={isVitalsSheetOpen}
        onClose={() => setIsVitalsSheetOpen(false)}
        onSubmit={handleRecordVitals}
      />
    </div>
  );
};
