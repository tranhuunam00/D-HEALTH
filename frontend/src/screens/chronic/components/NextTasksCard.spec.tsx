import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NextTasksCard } from './NextTasksCard';

describe('NextTasksCard Component TDD', () => {
  it('render tiêu đề Việc cần làm tiếp theo, các task và nút Đặt lịch tái khám', () => {
    const handleToggle = vi.fn();
    render(
      <NextTasksCard
        tasks={[
          { id: 't1', title: 'Theo dõi huyết áp sáng và tối', is_completed: false },
          { id: 't2', title: 'Xét nghiệm lipid máu trước tái khám', is_completed: true },
        ]}
        onToggleTask={handleToggle}
        nextCheckupDate="2026-11-12"
      />
    );

    expect(screen.getByText('Việc cần làm tiếp theo')).toBeDefined();
    expect(screen.getByText('Theo dõi huyết áp sáng và tối')).toBeDefined();
    expect(screen.getByText('Xét nghiệm lipid máu trước tái khám')).toBeDefined();
    expect(screen.getByText(/Đặt lịch tái khám 12\/11/)).toBeDefined();

    fireEvent.click(screen.getByText('Theo dõi huyết áp sáng và tối'));
    expect(handleToggle).toHaveBeenCalledWith('t1');
  });
});
