import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDevicesLogic } from './useDevicesLogic';

describe('useDevicesLogic Hook TDD', () => {
  it('khởi tạo với danh sách thiết bị ban đầu và đếm số thiết bị đã kết nối', () => {
    const { result } = renderHook(() => useDevicesLogic());
    expect(result.current.devices.length).toBe(11);
    expect(result.current.connectedCount).toBe(3);
    expect(result.current.isScanning).toBe(false);
  });

  it('hỗ trợ bật quét tìm thiết bị mới scanning state', () => {
    const { result } = renderHook(() => useDevicesLogic());
    act(() => {
      result.current.startScan();
    });
    expect(result.current.isScanning).toBe(true);
  });

  it('hỗ trợ toggle kết nối một thiết bị', () => {
    const { result } = renderHook(() => useDevicesLogic());
    act(() => {
      result.current.toggleDeviceConnection('omron-bp');
    });
    expect(result.current.connectedCount).toBe(2);
  });
});
