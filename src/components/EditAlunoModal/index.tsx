import { useState, useEffect } from 'react'
import { useAlunosStore, selectLoading } from '../../stores/alunos'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useTranslation } from 'react-i18next'
import { useToast } from '../../hooks/use-toast'
import { User, Calendar, Check, X, Loader2 } from 'lucide-react'
import type { Aluno, AlunoInput } from '../../stores/alunos'

interface EditAlunoModalProps {
  aluno: Aluno | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAlunoModal({ aluno, open, onOpenChange }: EditAlunoModalProps) {
  const { updateAluno } = useAlunosStore()
  const loading = useAlunosStore(selectLoading)
  const { toast } = useToast()
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState<AlunoInput>({
    nome: '',
    idade: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (aluno) {
      setFormData({
        nome: aluno.nome,
        idade: aluno.idade
      })
    }
  }, [aluno])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!aluno || !formData.nome.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await updateAluno(aluno.id, formData)
      
      toast({
        title: t('common.success'),
        description: t('students.edit.successMessage'),
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao atualizar aluno',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (aluno) {
      setFormData({
        nome: aluno.nome,
        idade: aluno.idade
      })
    }
    onOpenChange(false)
  }

  const isLoading = isSubmitting || loading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t('students.edit.title')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-field">
            <Label htmlFor="edit-nome" className="text-gray-700 dark:text-gray-300">
              {t('students.form.name.label')}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="edit-nome"
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
            <Label htmlFor="edit-idade" className="text-gray-700 dark:text-gray-300">
              {t('students.form.age.label')}
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="edit-idade"
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

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="flex-1 gap-2"
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
                  {t('students.form.save')}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1 gap-2"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 