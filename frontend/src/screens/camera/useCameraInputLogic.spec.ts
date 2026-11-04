import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCameraInputLogic } from './useCameraInputLogic';

describe('useCameraInputLogic Hook TDD', () => {
  it('khởi tạo với loại kết quả lab và phương thức manual', () => {
    const { result } = renderHook(() => useCameraInputLogic());
    expect(result.current.kind).toBe('lab');
    expect(result.current.method).toBe('manual');
    expect(result.current.rows.length).toBe(1);
    expect(result.current.rows[0].name).toBe('LDL-C');
    expect(result.current.showCls).toBe(false);
  });

  it('hỗ trợ chuyển đổi loại kết quả và cách nhập', () => {
    const { result } = renderHook(() => useCameraInputLogic());
    act(() => {
      result.current.setKind('img');
      result.current.setMethod('cam');
    });
    expect(result.current.kind).toBe('img');
    expect(result.current.method).toBe('cam');
  });

  it('thêm và xoá dòng chỉ số xét nghiệm', () => {
    const { result } = renderHook(() => useCameraInputLogic());
    act(() => {
      result.current.addRow();
    });
    expect(result.current.rows.length).toBe(2);

    act(() => {
      result.current.removeRow(0);
    });
    expect(result.current.rows.length).toBe(1);
  });

  it('tự động đề xuất phân loại nhóm xét nghiệm khi có giá trị (BR-110, BR-111)', () => {
    const { result } = renderHook(() => useCameraInputLogic());
    // Ban đầu chưa có giá trị -> không hiện đề xuất
    expect(result.current.showCls).toBe(false);

    // Nhập giá trị cho dòng 0 (LDL-C -> nhóm SH)
    act(() => {
      result.current.updateRow(0, { value: '3.8' });
    });
    expect(result.current.showCls).toBe(true);
    expect(result.current.sugCode).toBe('SH');
  });

  it('cảnh báo phiếu có chỉ số thuộc nhiều nhóm (BR-113)', () => {
    const { result } = renderHook(() => useCameraInputLogic());
    act(() => {
      result.current.updateRow(0, { value: '3.8' }); // LDL-C (SH)
      result.current.addRow(); // Dòng 1
    });
    act(() => {
      result.current.updateRow(1, { name: 'Hemoglobin (Hb)', value: '145' }); // HH
    });

    expect(result.current.mixed).toBe(true);
    expect(result.current.mixList).toContain('SH');
    expect(result.current.mixList).toContain('HH');
  });

  it('cho phép chỉnh sửa phân loại thủ công và hoàn tác về đề xuất (BR-112)', () => {
    const { result } = renderHook(() => useCameraInputLogic());
    act(() => {
      result.current.updateRow(0, { value: '3.8' });
      result.current.setSelectedCls('HH');
    });

    expect(result.current.overridden).toBe(true);
    expect(result.current.curCode).toBe('HH');

    act(() => {
      result.current.resetCls();
    });
    expect(result.current.overridden).toBe(false);
    expect(result.current.curCode).toBe('SH');
  });

  it('hỗ trợ thêm và xoá tổn thương CĐHA', () => {
    const { result } = renderHook(() => useCameraInputLogic());
    act(() => {
      result.current.setKind('img');
      result.current.addLesion();
    });
    expect(result.current.lesions.length).toBe(2);

    act(() => {
      result.current.removeLesion(0);
    });
    expect(result.current.lesions.length).toBe(1);
  });

  it('hỗ trợ thêm và xoá dấu ấn GPB', () => {
    const { result } = renderHook(() => useCameraInputLogic());
    act(() => {
      result.current.setKind('gpb');
      result.current.addMarker();
    });
    expect(result.current.markers.length).toBe(2);

    act(() => {
      result.current.removeMarker(0);
    });
    expect(result.current.markers.length).toBe(1);
  });
});
