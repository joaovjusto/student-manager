import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { AlunosState, AlunosActions, AlunoInput } from './types'
import { alunosService } from '../../services/alunosService'

type AlunosStore = AlunosState & AlunosActions

export const useAlunosStore = create<AlunosStore>()(
  subscribeWithSelector((set, get) => ({
    alunos: [],
    loading: false,
    error: null,

    initialize: async () => {
      set({ loading: true, error: null })
      
      try {
        const unsubscribe = alunosService.subscribeToChanges((alunos) => {
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
      set({ loading: true, error: null })
      
      try {
        await alunosService.add(aluno)
      } catch (error) {
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Erro ao adicionar aluno'
        })
        throw error
      }
    },

    updateAluno: async (id: string, aluno: AlunoInput) => {
      set({ loading: true, error: null })
      
      try {
        await alunosService.update(id, aluno)
      } catch (error) {
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Erro ao atualizar aluno'
        })
        throw error
      }
    },

    deleteAluno: async (id: string) => {
      set({ loading: true, error: null })
      
      try {
        await alunosService.delete(id)
      } catch (error) {
        set({ 
          loading: false,
          error: error instanceof Error ? error.message : 'Erro ao deletar aluno'
        })
        throw error
      }
    },

    refresh: async () => {
      set({ loading: true, error: null })
      
      try {
        const alunos = await alunosService.getAll()
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