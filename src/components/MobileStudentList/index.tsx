import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { EditAlunoModal } from '../EditAlunoModal'
import { useAlunosStore, selectAlunos, selectLoading } from '../../stores/alunos'
import { useTranslation } from 'react-i18next'
import { useToast } from '../../hooks/use-toast'
import { User, Edit, Trash2, MoreVertical, RefreshCw } from 'lucide-react'
import type { Aluno } from '../../stores/alunos'

export function MobileStudentList() {
  const alunos = useAlunosStore(selectAlunos)
  const loading = useAlunosStore(selectLoading)
  const { deleteAluno } = useAlunosStore()
  const { t } = useTranslation()
  const { toast } = useToast()

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; aluno: Aluno | null }>({
    open: false,
    aluno: null
  })
  
  const [editModal, setEditModal] = useState<{ open: boolean; aluno: Aluno | null }>({
    open: false,
    aluno: null
  })

  const handleDeleteConfirm = async () => {
    if (deleteDialog.aluno) {
      try {
        await deleteAluno(deleteDialog.aluno.id)
        toast({
          title: t('common.success'),
          description: t('students.delete.successMessage'),
        })
        setDeleteDialog({ open: false, aluno: null })
      } catch (error) {
        toast({
          title: 'Erro',
          description: error instanceof Error ? error.message : 'Erro ao deletar aluno',
          variant: 'destructive',
        })
      }
    }
  }

  const handleEditClick = (aluno: Aluno) => {
    setEditModal({ open: true, aluno })
  }

  if (loading && alunos.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alunos.map((aluno) => (
        <Card key={aluno.id} className="group hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {aluno.nome}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {aluno.idade} {t('students.list.years')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleEditClick(aluno)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('common.edit')}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400"
                      onClick={() => setDeleteDialog({ open: true, aluno })}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('common.delete')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <EditAlunoModal
        aluno={editModal.aluno}
        open={editModal.open}
        onOpenChange={(open) => setEditModal({ open, aluno: null })}
      />

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, aluno: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
            <DialogDescription>
              {deleteDialog.aluno && t('students.delete.confirm', { name: deleteDialog.aluno.nome })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, aluno: null })}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={loading}
              className="w-full sm:w-auto gap-2"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 