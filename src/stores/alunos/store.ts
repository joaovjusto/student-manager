import { createPersistentStore } from '../../hooks/usePersistentStore'
import type { AlunosState, AlunosActions, AlunoInput } from './types'
import { STORAGE_KEYS } from '../../constants'

type AlunosStore = AlunosState & AlunosActions

const generateId = (): string => crypto.randomUUID()

export const useAlunosStore = createPersistentStore<AlunosStore>(
  (set) => ({
    alunos: [],

    addAluno: (aluno: AlunoInput) =>
      set((state) => ({
        alunos: [...state.alunos, { ...aluno, id: generateId() }],
      })),

    deleteAluno: (id: string) =>
      set((state) => ({
        alunos: state.alunos.filter((aluno) => aluno.id !== id),
      })),

    updateAluno: (id: string, alunoAtualizado: AlunoInput) =>
      set((state) => ({
        alunos: state.alunos.map((aluno) =>
          aluno.id === id ? { ...alunoAtualizado, id } : aluno
        ),
      })),
  }),
  STORAGE_KEYS.ALUNOS_STORE
) 