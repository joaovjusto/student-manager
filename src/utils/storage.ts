import { STORAGE_KEYS } from '../constants'

interface StorageAdapter {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

class SafeStorageAdapter implements StorageAdapter {
  private storage: Storage

  constructor(storage: Storage) {
    this.storage = storage
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key)
    } catch (error) {
      console.warn(`Failed to get item "${key}" from storage:`, error)
      return null
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value)
    } catch (error) {
      console.warn(`Failed to set item "${key}" in storage:`, error)
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove item "${key}" from storage:`, error)
    }
  }
}

export const storage = new SafeStorageAdapter(localStorage)

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]

export const storageUtils = {
  getJSON: <T>(key: string, fallback: T): T => {
    const item = storage.getItem(key)
    if (!item) return fallback
    
    try {
      return JSON.parse(item) as T
    } catch (error) {
      console.warn(`Failed to parse JSON for key "${key}":`, error)
      return fallback
    }
  },

  setJSON: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value)
      storage.setItem(key, serialized)
    } catch (error) {
      console.warn(`Failed to serialize JSON for key "${key}":`, error)
    }
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.removeItem(key)
    })
  },

  exportData: (): Record<string, unknown> => {
    const data: Record<string, unknown> = {}
    
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = storage.getItem(key)
      if (item) {
        try {
          data[key] = JSON.parse(item)
        } catch {
          data[key] = item
        }
      }
    })
    
    return data
  },

  importData: (data: Record<string, unknown>): void => {
    const validKeys = Object.values(STORAGE_KEYS) as string[]
    
    Object.entries(data).forEach(([key, value]) => {
      if (validKeys.includes(key)) {
        if (typeof value === 'string') {
          storage.setItem(key, value)
        } else {
          storageUtils.setJSON(key, value)
        }
      }
    })
  },
} 