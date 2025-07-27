import { useState } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'

const LANGUAGES = [
  { label: 'Português', value: 'pt-BR', flag: '🇧🇷' },
  { label: 'English', value: 'en-US', flag: '🇺🇸' }
] as const

export function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  
  const currentLanguage = LANGUAGES.find(lang => lang.value === i18n.language) || LANGUAGES[0]

  const handleLanguageChange = (langValue: string) => {
    void i18n.changeLanguage(langValue)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="gap-2 px-3 h-8 text-xs"
        >
          <span>{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => handleLanguageChange(language.value)}
            className="gap-2 cursor-pointer"
          >
            <span>{language.flag}</span>
            <span>{language.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 