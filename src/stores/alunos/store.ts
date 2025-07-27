import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { AlunosState, AlunosActions, AlunoInput } from './types'
import { alunosService } from '../../services/alunosService'
import { useAuth } from '../../hooks/useAuth'

type AlunosStore = AlunosState & AlunosActions

export const useAlunosStore = create<AlunosStore>()(
  subscribeWithSelector((set, get) => ({
    alunos: [],
    loading: false,
    error: null,

    initialize: async () => {
      const { currentUser } = useAuth()
      if (!currentUser) return

      set({ loading: true, error: null })
      
      try {
        const unsubscribe = alunosService.subscribeToChanges(currentUser.uid, (alunos) => {
          set({ alunos, loading: false, error: null })
        })

        set({ _unsubscribe: unsubscribe })
      } catch (error) {
        set({ 
          loading: false, 
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    },

    addAluno: async (aluno: AlunoInput) => {
      const { currentUser } = useAuth()
      if (!currentUser) {
        throw new Error('Usuário não autenticado')
      }

      set({ loading: true, error: null })
      
      try {
        await alunosService.add({
          ...aluno,
          userId: currentUser.uid
        })
      } catch (error) {
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Erro ao adicionar aluno'
        })
        throw error
      }
    },

    updateAluno: async (id: string, aluno: AlunoInput) => {
      const { currentUser } = useAuth()
      if (!currentUser) {
        throw new Error('Usuário não autenticado')
      }

      set({ loading: true, error: null })
      
      try {
        await alunosService.update(id, {
          ...aluno,
          userId: currentUser.uid
        })
      } catch (error) {
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Erro ao atualizar aluno'
        })
        throw error
      }
    },

    deleteAluno: async (id: string) => {
      const { currentUser } = useAuth()
      if (!currentUser) {
        throw new Error('Usuário não autenticado')
      }

      set({ loading: true, error: null })
      
      try {
        await alunosService.delete(id, currentUser.uid)
      } catch (error) {
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Erro ao deletar aluno'
        })
        throw error
      }
    },

    refresh: async () => {
      const { currentUser } = useAuth()
      if (!currentUser) {
        throw new Error('Usuário não autenticado')
      }

      set({ loading: true, error: null })
      
      try {
        const alunos = await alunosService.getAll(currentUser.uid)
        set({ alunos, loading: false, error: null })
      } catch (error) {
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Erro ao carregar dados'
        })
      }
    },

    clearError: () => {
      set({ error: null })
    },

    cleanup: () => {
      const state = get()
      if (state._unsubscribe) {
        state._unsubscribe()
        set({ _unsubscribe: undefined })
      }
    },

    _unsubscribe: undefined,
  }))
) 