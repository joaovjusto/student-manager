import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useTheme } from '../../contexts/ThemeContext'
import { LanguageSelector } from '../LanguageSelector'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '../../constants'
import { Users, List, UserPlus, Sun, Moon } from 'lucide-react'

export function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const isListActive = location.pathname === ROUTES.HOME
  const isCadastroActive = location.pathname === ROUTES.CADASTRO

  return (
    <header className={`w-full border-b ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="page-container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {t('app.title')}
            </span>
          </div>

          <nav className="flex items-center gap-2">
            <Button
              variant={isListActive ? "default" : "ghost"}
              onClick={() => navigate(ROUTES.HOME)}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              {t('students.list.title')}
            </Button>
            <Button
              variant={isCadastroActive ? "default" : "ghost"}
              onClick={() => navigate(ROUTES.CADASTRO)}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {t('students.form.title')}
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t(`common.theme.${theme}`)}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  )
} 