import { useAlunosStore, selectAlunos, selectLoading, selectError } from '../../stores/alunos'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip'
import { EditAlunoModal } from '../../components/EditAlunoModal'
import { MobileStudentList } from '../../components/MobileStudentList'
import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/use-toast'
import { ROUTES } from '../../constants'
import { useState } from 'react'
import { Users, Plus, Edit, Trash2, Inbox, RefreshCw, AlertCircle } from 'lucide-react'
import type { Aluno } from '../../stores/alunos'

export function ListagemAlunos() {
  const alunos = useAlunosStore(selectAlunos)
  const loading = useAlunosStore(selectLoading)
  const error = useAlunosStore(selectError)
  const { deleteAluno, refresh, clearError } = useAlunosStore()
  const { theme } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isDark = theme === 'dark'
  
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

  const handleEditModalClose = () => {
    setEditModal({ open: false, aluno: null })
  }

  const handleRefresh = async () => {
    try {
      await refresh()
      toast({
        title: t('common.success'),
        description: 'Dados atualizados com sucesso!',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar dados',
        variant: 'destructive',
      })
    }
  }

  const handleClearError = () => {
    clearError()
  }

  if (error) {
    return (
      <div className="h-full flex flex-col animate-fade-in">
        <Card className="flex-1">
          <CardContent className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200 text-center">
              Erro ao carregar dados
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4 text-center max-w-md text-sm sm:text-base">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleRefresh} disabled={loading} className="gap-2 w-full sm:w-auto">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Tentar novamente
              </Button>
              <Button onClick={handleClearError} variant="outline" className="w-full sm:w-auto">
                Limpar erro
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-500 dark:text-gray-400">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <Inbox className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-xl font-medium mb-2 text-center">{t('students.list.empty')}</p>
      <Button
        onClick={() => navigate(ROUTES.CADASTRO)}
        className="mt-4 gap-2 w-full sm:w-auto"
        disabled={loading}
      >
        <Plus className="h-4 w-4" />
        {t('students.form.title')}
      </Button>
    </div>
  )

  const header = (
    <CardHeader className="pb-4 sm:pb-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${
            isDark ? 'bg-gray-700' : 'bg-primary/10'
          }`}>
            <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t('students.list.title')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {loading ? 'Carregando...' : t('students.list.count', { count: alunos.length })}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="gap-2 flex-1 sm:flex-initial"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="sm:hidden">Atualizar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Atualizar dados</p>
            </TooltipContent>
          </Tooltip>
          <Button
            onClick={() => navigate(ROUTES.CADASTRO)}
            className="gap-2 flex-1 sm:flex-initial"
            disabled={loading}
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('students.form.title')}</span>
            <span className="sm:hidden">Novo Aluno</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  )

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <Card className="flex-1">
        {header}
        <CardContent className="pt-0 px-4 sm:px-6">
          {loading && alunos.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">Carregando dados...</span>
            </div>
          ) : alunos.length === 0 ? (
            emptyState
          ) : (
            <>
              <div className="hidden md:block">
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
                                  onClick={() => setDeleteDialog({ open: true, aluno })}
                                  className="hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400"
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden">
                <MobileStudentList />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <EditAlunoModal
        aluno={editModal.aluno}
        open={editModal.open}
        onOpenChange={handleEditModalClose}
      />

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, aluno: null })}>
        <DialogContent className="sm:max-w-md mx-4">
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