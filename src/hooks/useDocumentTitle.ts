import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const useDocumentTitle = () => {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const updateTitle = () => {
      document.title = t('app.title')
    }

    // Update title when language changes
    updateTitle()
    i18n.on('languageChanged', updateTitle)

    return () => {
      i18n.off('languageChanged', updateTitle)
    }
  }, [t, i18n])
} 