import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { RecistEvaluationSection } from './RecistEvaluationSection';

describe('RecistEvaluationSection Component TDD', () => {
  it('render đầy đủ thẻ đáp ứng PR, các chỉ số kích thước và 4 tiêu chuẩn RECIST', () => {
    render(
      <RecistEvaluationSection
        enabled={true}
        onToggle={vi.fn()}
        evaluationData={{
          responseCode: 'PR',
          responseLabel: 'Đáp ứng một phần',
          note: '–36,7% so với ban đầu · 20/08/26',
          baselineMm: 60,
          nadirMm: 38,
          currentMm: 38,
        }}
      />
    );

    expect(screen.getByText('Đánh giá đáp ứng RECIST 1.1')).toBeDefined();
    expect(screen.getAllByText('Đáp ứng một phần').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/–36,7%/)).toBeDefined();
    expect(screen.getByText('Ban đầu')).toBeDefined();
    expect(screen.getByText('Nhỏ nhất')).toBeDefined();
    expect(screen.getByText('Hiện tại')).toBeDefined();
    expect(screen.getByText('CR · Đáp ứng hoàn toàn')).toBeDefined();
    expect(screen.getByText('SD · Bệnh ổn định')).toBeDefined();
    expect(screen.getByText('PD · Bệnh tiến triển')).toBeDefined();
  });

  it('gọi onToggle khi bấm nút switch', () => {
    const handleToggle = vi.fn();
    render(
      <RecistEvaluationSection
        enabled={true}
        onToggle={handleToggle}
        evaluationData={null}
      />
    );

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(handleToggle).toHaveBeenCalledWith(false);
  });
});
