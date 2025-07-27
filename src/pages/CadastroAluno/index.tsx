import { useNavigate } from 'react-router-dom'
import { useAlunosStore } from '../../stores/alunos'
import { AlunoForm } from '../../components/AlunoForm'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { useToast } from '../../hooks/use-toast'
import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { ROUTES, ANIMATION_DURATION } from '../../constants'
import { UserPlus } from 'lucide-react'

export function CadastroAluno() {
  const navigate = useNavigate()
  const { addAluno } = useAlunosStore()
  const { toast } = useToast()
  const { theme } = useTheme()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const handleSubmit = (aluno: Parameters<typeof addAluno>[0]) => {
    addAluno(aluno)
    toast({
      title: t('common.success'),
      description: t('students.form.successMessage'),
    })
    setTimeout(() => {
      navigate(ROUTES.HOME)
    }, ANIMATION_DURATION.SHORT)
  }

  return (
    <div className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? 'bg-primary/20' : 'bg-primary/10'
            }`}>
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{t('students.form.title')}</h1>
          </div>
        </CardHeader>
        <CardContent>
          <AlunoForm
            onSubmit={handleSubmit}
            submitLabel="students.form.submit"
          />
        </CardContent>
      </Card>
    </div>
  )
} 