import { vi, describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFirebaseStore } from '../useFirebaseStore'
import { useAlunosStore } from '../../stores/alunos'

vi.mock('../../stores/alunos', () => ({
  useAlunosStore: vi.fn(),
}))

describe('useFirebaseStore', () => {
  const mockInitialize = vi.fn()
  const mockCleanup = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAlunosStore as any).mockReturnValue({
      initialize: mockInitialize,
      cleanup: mockCleanup,
    })
  })

  it('initializes store on mount', () => {
    renderHook(() => useFirebaseStore())
    expect(mockInitialize).toHaveBeenCalled()
  })

  it('cleans up store on unmount', () => {
    const { unmount } = renderHook(() => useFirebaseStore())
    unmount()
    expect(mockCleanup).toHaveBeenCalled()
  })

  it('calls initialize only once', () => {
    renderHook(() => useFirebaseStore())
    expect(mockInitialize).toHaveBeenCalledTimes(1)
  })

  it('handles errors during initialization', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockInitialize.mockRejectedValueOnce(new Error('Initialization failed'))

    renderHook(() => useFirebaseStore())
    expect(mockInitialize).toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('handles errors during cleanup', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockCleanup.mockImplementationOnce(() => {
      throw new Error('Cleanup failed')
    })

    const { unmount } = renderHook(() => useFirebaseStore())
    unmount()
    expect(mockCleanup).toHaveBeenCalled()

    consoleError.mockRestore()
  })
}) 