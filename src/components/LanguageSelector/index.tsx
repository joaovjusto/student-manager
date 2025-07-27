import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import type { Language } from '../../types'

const LANGUAGES: Language[] = [
  { label: 'Português', value: 'pt-BR', flag: '🇧🇷' },
  { label: 'English', value: 'en-US', flag: '🇺🇸' }
]

export function LanguageSelector() {
  const { i18n } = useTranslation()

  const selectedLanguage = LANGUAGES.find(lang => lang.value === i18n.language) ?? LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 min-w-[140px] justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedLanguage.flag}</span>
            <span>{selectedLanguage.label}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => void i18n.changeLanguage(language.value)}
            className="gap-2"
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 