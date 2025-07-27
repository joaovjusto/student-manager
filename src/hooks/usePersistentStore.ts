import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateCreator } from 'zustand'

export function createPersistentStore<T extends object>(
  stateCreator: StateCreator<T>,
  storageKey: string,
  version = 1
) {
  return create<T>()(
    persist(
      stateCreator,
      {
        name: storageKey,
        storage: createJSONStorage(() => localStorage),
        version,
      }
    )
  )
} 