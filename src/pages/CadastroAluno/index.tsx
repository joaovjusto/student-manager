import { useAlunosStore, selectLoading } from '../../stores/alunos'
import { AlunoForm } from '../../components/AlunoForm'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useToast } from '../../hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { ROUTES } from '../../constants'
import type { AlunoInput } from '../../stores/alunos'

export function CadastroAluno() {
  const { addAluno } = useAlunosStore()
  const loading = useAlunosStore(selectLoading)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const handleSubmit = async (aluno: AlunoInput) => {
    try {
      await addAluno(aluno)
      
      toast({
        title: t('common.success'),
        description: t('students.form.successMessage'),
      })

      navigate(ROUTES.HOME)
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao cadastrar aluno',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex-1 flex items-start justify-center px-4 py-6 sm:py-8">
        <Card className="w-full max-w-lg">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${
                isDark ? 'bg-gray-700' : 'bg-primary/10'
              }`}>
                <UserPlus className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {t('students.form.title')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Preencha os dados para cadastrar um novo aluno
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <AlunoForm 
              onSubmit={handleSubmit}
              submitLabel="students.form.submit"
              disabled={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 