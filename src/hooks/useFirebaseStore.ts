import { useEffect } from 'react'
import { useAlunosStore } from '../stores/alunos'

export function useFirebaseStore() {
  const { initialize, cleanup } = useAlunosStore()

  useEffect(() => {
    void initialize()

    return () => {
      cleanup()
    }
  }, [initialize, cleanup])
} 