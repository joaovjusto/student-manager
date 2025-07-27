import type { BaseEntity } from '../../types'

export interface Aluno extends BaseEntity {
  readonly nome: string
  readonly idade: number
}

export type AlunoInput = Omit<Aluno, 'id'>

export interface AlunosState {
  readonly alunos: ReadonlyArray<Aluno>
}

export interface AlunosActions {
  readonly addAluno: (aluno: AlunoInput) => void
  readonly deleteAluno: (id: string) => void
  readonly updateAluno: (id: string, aluno: AlunoInput) => void
} 