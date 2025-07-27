import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { LanguageSelector } from '../LanguageSelector'
import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { Users, List, UserPlus, Sun, Moon, Menu } from 'lucide-react'
import { ROUTES } from '../../constants'
import { useState } from 'react'

export function TopBar() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isDark = theme === 'dark'

  const isActive = (path: string) => location.pathname === path

  const menuItems = [
    {
      label: t('students.list.title'),
      icon: List,
      path: ROUTES.HOME,
      active: isActive(ROUTES.HOME)
    },
    {
      label: t('students.form.title'),
      icon: UserPlus,
      path: ROUTES.CADASTRO,
      active: isActive(ROUTES.CADASTRO)
    }
  ]

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {t('app.title')}
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={item.active ? 'default' : 'ghost'}
                onClick={() => navigate(item.path)}
                className="gap-2 text-sm"
                size="sm"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-1 sm:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="w-8 h-8 sm:w-9 sm:h-9"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
                  ) : (
                    <Moon className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isDark ? t('common.theme.light') : t('common.theme.dark')}</p>
              </TooltipContent>
            </Tooltip>

            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant={item.active ? 'default' : 'ghost'}
                  onClick={() => {
                    navigate(item.path)
                    setMobileMenuOpen(false)
                  }}
                  className="gap-3 justify-start text-sm py-3 h-auto"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
              
              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 