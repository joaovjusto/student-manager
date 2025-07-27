import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext'
import { STORAGE_KEYS, DEFAULT_VALUES } from '../../constants'

describe('ThemeContext', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
  }

  const mockRoot = {
    classList: {
      remove: vi.fn(),
      add: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    })
    Object.defineProperty(window.document, 'documentElement', {
      value: mockRoot,
    })
  })

  describe('ThemeProvider', () => {
    it('initializes with stored theme', () => {
      mockLocalStorage.getItem.mockReturnValue('dark')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      expect(result.current.theme).toBe('dark')
      expect(mockRoot.classList.add).toHaveBeenCalledWith('dark')
    })

    it('initializes with default theme when storage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      expect(result.current.theme).toBe(DEFAULT_VALUES.THEME)
      expect(mockRoot.classList.add).toHaveBeenCalledWith(DEFAULT_VALUES.THEME)
    })

    it('initializes with default theme when storage has invalid value', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-theme')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      expect(result.current.theme).toBe(DEFAULT_VALUES.THEME)
    })

    it('handles storage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      expect(result.current.theme).toBe(DEFAULT_VALUES.THEME)
    })
  })

  describe('useTheme', () => {
    it('throws error when used outside provider', () => {
      const { result } = renderHook(() => useTheme())
      expect(result.error).toEqual(Error('useTheme deve ser usado dentro de um ThemeProvider'))
    })

    it('toggles theme', () => {
      mockLocalStorage.getItem.mockReturnValue('light')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('dark')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME, 'dark')
      expect(mockRoot.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(mockRoot.classList.add).toHaveBeenCalledWith('dark')
    })

    it('sets theme directly', () => {
      mockLocalStorage.getItem.mockReturnValue('dark')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      act(() => {
        result.current.setTheme('light')
      })

      expect(result.current.theme).toBe('light')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME, 'light')
      expect(mockRoot.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(mockRoot.classList.add).toHaveBeenCalledWith('light')
    })

    it('handles storage errors when setting theme', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      act(() => {
        result.current.setTheme('dark')
      })

      expect(result.current.theme).toBe('dark')
      expect(consoleWarn).toHaveBeenCalled()

      consoleWarn.mockRestore()
    })
  })

  describe('Theme classes', () => {
    it('updates document classes when theme changes', () => {
      mockLocalStorage.getItem.mockReturnValue('light')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      expect(mockRoot.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(mockRoot.classList.add).toHaveBeenCalledWith('light')

      act(() => {
        result.current.toggleTheme()
      })

      expect(mockRoot.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(mockRoot.classList.add).toHaveBeenCalledWith('dark')
    })
  })

  describe('Provider rendering', () => {
    it('renders children with theme context', () => {
      const TestComponent = () => {
        const { theme } = useTheme()
        return <div data-testid="test">{theme}</div>
      }

      mockLocalStorage.getItem.mockReturnValue('dark')

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      expect(getByTestId('test')).toHaveTextContent('dark')
    })
  })
}) 