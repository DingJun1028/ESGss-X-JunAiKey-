// src/hooks/__tests__/useUniversalRectification.test.ts

import { renderHook, act } from '@testing-library/react-hooks';
import { useUniversalRectification } from '../useUniversalRectification';
import { EntropyForge } from '../../core/rectification/EntropyForge';

// Mock 核心邏輯，專注於測試 Hook 的狀態變化
jest.spyOn(EntropyForge, 'purify').mockImplementation(async (val) => {
  if (val === null) {
    return {
      data: 42, // 修復後的值
      originalData: null,
      entropy: 'HIGH',
      strategyUsed: 'GAP_FILLING',
      confidence: 70,
      witnessSignature: 'TEST-SIG'
    };
  }
  return {
    data: val,
    originalData: val,
    entropy: 'ZERO',
    strategyUsed: 'PASS_THROUGH',
    confidence: 100,
    witnessSignature: 'TEST-SIG'
  };
});

describe('🛡️ useUniversalRectification (免疫鉤子)', () => {

  test('初始狀態應為修復中 (IsHealing)', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUniversalRectification(null, 'test-id')
    );

    // 剛掛載時，應該正在執行異步修復
    expect(result.current.isHealing).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isHealing).toBe(false);
  });

  test('當輸入為 Null 時，應返回修復後的值並標記 isRectified', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUniversalRectification(null, 'test-id')
    );

    await waitForNextUpdate();

    expect(result.current.value).toBe(42); // 變成了 42
    expect(result.current.isRectified).toBe(true); // 標記為已修復
    expect(result.current.metadata?.strategyUsed).toBe('GAP_FILLING');
  });

  test('當輸入正常時，應保持原值且不標記 isRectified', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUniversalRectification(100, 'test-id')
    );

    await waitForNextUpdate();

    expect(result.current.value).toBe(100);
    expect(result.current.isRectified).toBe(false);
  });
});