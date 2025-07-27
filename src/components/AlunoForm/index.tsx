import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent } from '../ui/card'
import { User, Calendar, Check, X, Loader2 } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import type { Aluno, AlunoInput } from '../../stores/alunos'

interface AlunoFormProps {
  aluno?: Partial<Aluno>
  onSubmit: (aluno: AlunoInput) => void | Promise<void>
  onCancel?: () => void
  submitLabel?: 'students.form.submit' | 'students.form.save'
  disabled?: boolean
}

export function AlunoForm({
  aluno = {},
  onSubmit,
  onCancel,
  submitLabel = 'students.form.submit',
  disabled = false
}: AlunoFormProps) {
  const [formData, setFormData] = useState({
    nome: aluno.nome || '',
    idade: aluno.idade || 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.nome.trim() || isSubmitting || disabled) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      if (!aluno.id) {
        setFormData({ nome: '', idade: 0 })
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = isSubmitting || disabled

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-field">
            <Label htmlFor="nome" className="text-gray-700 dark:text-gray-300">
              {t('students.form.name.label')}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder={t('students.form.name.placeholder')}
                className="pl-10"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <Label htmlFor="idade" className="text-gray-700 dark:text-gray-300">
              {t('students.form.age.label')}
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="idade"
                type="number"
                value={formData.idade}
                onChange={(e) => setFormData(prev => ({ ...prev, idade: parseInt(e.target.value) || 0 }))}
                placeholder={t('students.form.age.placeholder')}
                min={0}
                max={150}
                className="pl-10"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button 
              type="submit" 
              className="w-full gap-2" 
              disabled={isLoading || !formData.nome.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {t(submitLabel)}
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 