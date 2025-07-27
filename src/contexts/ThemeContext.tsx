import { createContext, useContext, useEffect, useState } from 'react'
import { STORAGE_KEYS, DEFAULT_VALUES } from '../constants'
import type { Theme, ThemeContextType } from '../types'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
}

const getStoredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME)
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored as Theme
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error)
  }
  return DEFAULT_VALUES.THEME as Theme
}

const setStoredTheme = (theme: Theme): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error)
  }
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setStoredTheme(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
} 