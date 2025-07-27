import type { AlunosState } from './types'

export const selectAlunos = (state: AlunosState) => state.alunos
export const selectLoading = (state: AlunosState) => state.loading
export const selectError = (state: AlunosState) => state.error
export const selectIsEmpty = (state: AlunosState) => state.alunos.length === 0
export const selectAlunosCount = (state: AlunosState) => state.alunos.length 