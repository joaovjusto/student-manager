import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useTranslation } from 'react-i18next'
import { useAlunosStore } from '../../stores/alunos'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Aluno } from '../../stores/alunos'

export function MobileStudentList() {
  const { t } = useTranslation()
  const { alunos, loading, deleteAluno } = useAlunosStore()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteAluno(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse" data-testid="student-skeleton">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {alunos.map((aluno) => (
          <Card key={aluno.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{aluno.nome}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {aluno.idade} {t('students.list.years')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingAluno(aluno)}
                  disabled={loading}
                  aria-label={t('common.edit')}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(aluno.id)}
                  disabled={loading}
                  aria-label={t('common.delete')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
          </DialogHeader>
          <p>{t('students.delete.confirm')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingAluno && (
        <Dialog open={!!editingAluno} onOpenChange={() => setEditingAluno(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('students.edit.title')}</DialogTitle>
            </DialogHeader>
            {/* Add edit form here */}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
} 