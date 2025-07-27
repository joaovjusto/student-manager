import { vi, describe, it, expect, beforeEach } from 'vitest'
import { storage, storageUtils } from '../storage'
import { STORAGE_KEYS } from '../../constants'

describe('SafeStorageAdapter', () => {
  const mockStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
    })
  })

  it('handles getItem success', () => {
    mockStorage.getItem.mockReturnValue('test-value')
    expect(storage.getItem('test-key')).toBe('test-value')
  })

  it('handles getItem failure', () => {
    mockStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error')
    })
    expect(storage.getItem('test-key')).toBeNull()
  })

  it('handles setItem success', () => {
    storage.setItem('test-key', 'test-value')
    expect(mockStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value')
  })

  it('handles setItem failure', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockStorage.setItem.mockImplementation(() => {
      throw new Error('Storage error')
    })

    storage.setItem('test-key', 'test-value')
    expect(consoleWarn).toHaveBeenCalled()

    consoleWarn.mockRestore()
  })

  it('handles removeItem success', () => {
    storage.removeItem('test-key')
    expect(mockStorage.removeItem).toHaveBeenCalledWith('test-key')
  })

  it('handles removeItem failure', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockStorage.removeItem.mockImplementation(() => {
      throw new Error('Storage error')
    })

    storage.removeItem('test-key')
    expect(consoleWarn).toHaveBeenCalled()

    consoleWarn.mockRestore()
  })
})

describe('storageUtils', () => {
  const mockStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
    })
  })

  describe('getJSON', () => {
    it('returns parsed JSON when valid', () => {
      const testData = { test: 'value' }
      mockStorage.getItem.mockReturnValue(JSON.stringify(testData))

      expect(storageUtils.getJSON('test-key', null)).toEqual(testData)
    })

    it('returns fallback when key not found', () => {
      mockStorage.getItem.mockReturnValue(null)
      const fallback = { default: true }

      expect(storageUtils.getJSON('test-key', fallback)).toEqual(fallback)
    })

    it('returns fallback when JSON is invalid', () => {
      mockStorage.getItem.mockReturnValue('invalid-json')
      const fallback = { default: true }

      expect(storageUtils.getJSON('test-key', fallback)).toEqual(fallback)
    })
  })

  describe('setJSON', () => {
    it('stores stringified JSON', () => {
      const testData = { test: 'value' }
      storageUtils.setJSON('test-key', testData)

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData)
      )
    })

    it('handles circular references', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const circular: any = {}
      circular.self = circular

      storageUtils.setJSON('test-key', circular)
      expect(consoleWarn).toHaveBeenCalled()

      consoleWarn.mockRestore()
    })
  })

  describe('clearAll', () => {
    it('removes all storage keys', () => {
      storageUtils.clearAll()

      Object.values(STORAGE_KEYS).forEach(key => {
        expect(mockStorage.removeItem).toHaveBeenCalledWith(key)
      })
    })
  })

  describe('exportData', () => {
    it('exports all storage data', () => {
      const testData = {
        [STORAGE_KEYS.THEME]: 'dark',
        [STORAGE_KEYS.LANGUAGE]: 'en',
      }

      Object.entries(testData).forEach(([key, value]) => {
        mockStorage.getItem.mockImplementation((k) => 
          k === key ? JSON.stringify(value) : null
        )
      })

      expect(storageUtils.exportData()).toEqual(testData)
    })

    it('handles invalid JSON in export', () => {
      mockStorage.getItem.mockReturnValue('invalid-json')

      const exported = storageUtils.exportData()
      Object.values(STORAGE_KEYS).forEach(key => {
        expect(exported[key]).toBe('invalid-json')
      })
    })
  })

  describe('importData', () => {
    it('imports valid data', () => {
      const testData = {
        [STORAGE_KEYS.THEME]: 'dark',
        [STORAGE_KEYS.LANGUAGE]: 'en',
      }

      storageUtils.importData(testData)

      Object.entries(testData).forEach(([key, value]) => {
        expect(mockStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
      })
    })

    it('ignores invalid keys', () => {
      const testData = {
        [STORAGE_KEYS.THEME]: 'dark',
        'invalid-key': 'value',
      }

      storageUtils.importData(testData)

      expect(mockStorage.setItem).toHaveBeenCalledTimes(1)
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.THEME,
        JSON.stringify('dark')
      )
    })

    it('handles string values', () => {
      const testData = {
        [STORAGE_KEYS.THEME]: 'raw-string',
      }

      storageUtils.importData(testData)

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.THEME,
        'raw-string'
      )
    })
  })
}) 