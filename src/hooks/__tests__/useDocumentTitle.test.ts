import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useDocumentTitle } from '../useDocumentTitle'
import i18n from '../../i18n'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key === 'app.title' ? 'Student Manager' : key,
    i18n: {
      on: vi.fn(),
      off: vi.fn(),
    },
  }),
}))

describe('useDocumentTitle', () => {
  beforeEach(() => {
    document.title = ''
    vi.clearAllMocks()
  })

  it('should set document title on mount', () => {
    renderHook(() => useDocumentTitle())
    expect(document.title).toBe('Student Manager')
  })

  it('should subscribe to language changes', () => {
    const onSpy = vi.spyOn(i18n, 'on')
    const offSpy = vi.spyOn(i18n, 'off')

    const { unmount } = renderHook(() => useDocumentTitle())

    expect(onSpy).toHaveBeenCalledWith('languageChanged', expect.any(Function))

    unmount()

    expect(offSpy).toHaveBeenCalledWith('languageChanged', expect.any(Function))
  })
}) 