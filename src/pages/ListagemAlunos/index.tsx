import { useAlunosStore, selectAlunos } from '../../stores/alunos'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip'
import { EditAlunoModal } from '../../components/EditAlunoModal'
import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { useState } from 'react'
import { Users, Plus, Edit, Trash2, Inbox } from 'lucide-react'
import type { Aluno } from '../../stores/alunos'

export function ListagemAlunos() {
  const alunos = useAlunosStore(selectAlunos)
  const { deleteAluno } = useAlunosStore()
  const { theme } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isDark = theme === 'dark'
  
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; aluno: Aluno | null }>({
    open: false,
    aluno: null
  })
  
  const [editModal, setEditModal] = useState<{ open: boolean; aluno: Aluno | null }>({
    open: false,
    aluno: null
  })

  const handleDeleteConfirm = () => {
    if (deleteDialog.aluno) {
      deleteAluno(deleteDialog.aluno.id)
      setDeleteDialog({ open: false, aluno: null })
    }
  }

  const handleEditClick = (aluno: Aluno) => {
    setEditModal({ open: true, aluno })
  }

  const handleEditModalClose = () => {
    setEditModal({ open: false, aluno: null })
  }

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <Inbox className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-xl font-medium mb-2">{t('students.list.empty')}</p>
      <Button
        onClick={() => navigate(ROUTES.CADASTRO)}
        className="mt-4 gap-2"
      >
        <Plus className="h-4 w-4" />
        {t('students.form.title')}
      </Button>
    </div>
  )

  const header = (
    <CardHeader className="pb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            isDark ? 'bg-gray-700' : 'bg-primary/10'
          }`}>
            <Users className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('students.list.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('students.list.count', { count: alunos.length })}
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate(ROUTES.CADASTRO)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('students.form.title')}
        </Button>
      </div>
    </CardHeader>
  )

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <Card className="flex-1">
        {header}
        <CardContent className="pt-0">
          {alunos.length === 0 ? (
            emptyState
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('students.list.name')}</TableHead>
                  <TableHead className="w-[150px]">{t('students.list.age')}</TableHead>
                  <TableHead className="w-[150px]">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunos.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell className="text-center">
                      {aluno.idade} {t('students.list.years')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(aluno)}
                              className="hover:bg-gray-100 dark:hover:bg-gray-700"
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
                              onClick={() => setDeleteDialog({ open: true, aluno })}
                              className="hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('common.delete')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditAlunoModal
        aluno={editModal.aluno}
        open={editModal.open}
        onOpenChange={handleEditModalClose}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, aluno: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
            <DialogDescription>
              {deleteDialog.aluno && t('students.delete.confirm', { name: deleteDialog.aluno.nome })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, aluno: null })}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 