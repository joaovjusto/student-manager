import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createPersistentStore } from '../usePersistentStore'

describe('createPersistentStore', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    })
  })

  it('creates a store with initial state', () => {
    const useTestStore = createPersistentStore(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      'test-store'
    )

    const { result } = renderHook(() => useTestStore())
    expect(result.current.count).toBe(0)
  })

  it('updates state correctly', () => {
    const useTestStore = createPersistentStore(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      'test-store'
    )

    const { result } = renderHook(() => useTestStore())

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })

  it('persists state to localStorage', () => {
    const useTestStore = createPersistentStore(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      'test-store'
    )

    const { result } = renderHook(() => useTestStore())

    act(() => {
      result.current.increment()
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalled()
  })

  it('hydrates state from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({
        state: { count: 5 },
        version: 1,
      })
    )

    const useTestStore = createPersistentStore(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      'test-store'
    )

    const { result } = renderHook(() => useTestStore())
    expect(result.current.count).toBe(5)
  })

  it('handles invalid localStorage data', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json')

    const useTestStore = createPersistentStore(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      'test-store'
    )

    const { result } = renderHook(() => useTestStore())
    expect(result.current.count).toBe(0)
  })

  it('handles version changes', () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({
        state: { count: 5 },
        version: 1,
      })
    )

    const useTestStore = createPersistentStore(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      'test-store',
      2 // New version
    )

    const { result } = renderHook(() => useTestStore())
    expect(result.current.count).toBe(0)
  })

  it('handles multiple stores independently', () => {
    const useStore1 = createPersistentStore(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      'store-1'
    )

    const useStore2 = createPersistentStore(
      (set) => ({
        value: '',
        setValue: (value: string) => set({ value }),
      }),
      'store-2'
    )

    const { result: result1 } = renderHook(() => useStore1())
    const { result: result2 } = renderHook(() => useStore2())

    act(() => {
      result1.current.increment()
      result2.current.setValue('test')
    })

    expect(result1.current.count).toBe(1)
    expect(result2.current.value).toBe('test')
  })
}) 