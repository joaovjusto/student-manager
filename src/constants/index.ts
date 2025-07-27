export const ROUTES = {
  HOME: '/',
  CADASTRO: '/cadastro',
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const

export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'i18nextLng',
  ALUNOS_STORE: 'alunos-store',
} as const

export const DEFAULT_VALUES = {
  THEME: 'dark',
  LANGUAGE: 'pt-BR',
} as const

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const 