import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import ptBR from './locales/pt-BR'
import enUS from './locales/en-US'

const resources = {
  'pt-BR': ptBR,
  'en-US': enUS,
} as const

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translations'
    resources: {
      translations: typeof ptBR['translations']
    }
  }
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n 