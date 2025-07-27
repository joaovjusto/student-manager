import type { BaseEntity } from '../../types'

export interface Aluno extends BaseEntity {
  readonly nome: string
  readonly idade: number
}

export type AlunoInput = Omit<Aluno, 'id'>

export interface AlunosState {
  readonly alunos: ReadonlyArray<Aluno>
  readonly loading: boolean
  readonly error: string | null
  readonly _unsubscribe?: () => void
}

export interface AlunosActions {
  readonly initialize: () => Promise<void>
  readonly addAluno: (aluno: AlunoInput) => Promise<void>
  readonly deleteAluno: (id: string) => Promise<void>
  readonly updateAluno: (id: string, aluno: AlunoInput) => Promise<void>
  readonly refresh: () => Promise<void>
  readonly clearError: () => void
  readonly cleanup: () => void
} 