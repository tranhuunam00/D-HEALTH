import { useState, useMemo } from 'react';

export type LabCategory = 'all' | 'biochemistry' | 'hematology' | 'immunology' | 'urinalysis';

export interface LabReportItem {
  readonly id: string;
  readonly title: string;
  readonly facility: string;
  readonly testDate: string;
  readonly category: LabCategory;
  readonly abnormalCount: number;
  readonly summary: string;
  readonly hasAttachment: boolean;
}

const INITIAL_REPORTS: readonly LabReportItem[] = Object.freeze([
  {
    id: 'rep-01',
    title: 'Sinh hoá máu 18 chỉ số',
    facility: 'Bệnh viện Bạch Mai',
    testDate: '20/10/2026',
    category: 'biochemistry',
    abnormalCount: 2,
    summary: '2 chỉ số vượt ngưỡng (Glucose 7.2, LDL-C 3.8)',
    hasAttachment: true,
  },
  {
    id: 'rep-02',
    title: 'Tổng phân tích tế bào máu ngoại vi',
    facility: 'Bệnh viện Đại học Y Hà Nội',
    testDate: '15/09/2026',
    category: 'hematology',
    abnormalCount: 0,
    summary: 'Tất cả 24 chỉ số trong giới hạn tham chiếu',
    hasAttachment: true,
  },
  {
    id: 'rep-03',
    title: 'Xét nghiệm nước tiểu 10 thông số',
    facility: 'Phòng khám Đa khoa Medlatec',
    testDate: '10/08/2026',
    category: 'urinalysis',
    abnormalCount: 0,
    summary: 'Protein âm tính, pH 6.0',
    hasAttachment: false,
  },
]);

export function useLabsLogic() {
  const [selectedCategory, setSelectedCategory] = useState<LabCategory>('all');
  const [reports] = useState<readonly LabReportItem[]>(INITIAL_REPORTS);

  const filteredReports = useMemo(() => {
    if (selectedCategory === 'all') return reports;
    return reports.filter((r) => r.category === selectedCategory);
  }, [reports, selectedCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    reports,
    filteredReports,
  };
}
