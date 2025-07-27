export type Language = {
  readonly label: string
  readonly value: string
  readonly flag: string
}

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  readonly theme: Theme
  readonly setTheme: (theme: Theme) => void
  readonly toggleTheme: () => void
}

export type BaseEntity = {
  readonly id: string
} 