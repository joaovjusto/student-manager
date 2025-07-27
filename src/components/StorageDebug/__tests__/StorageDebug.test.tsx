import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import { StorageDebug } from '..'
import { storageUtils } from '../../../utils/storage'

vi.mock('../../../utils/storage', () => ({
  storageUtils: {
    exportData: vi.fn(),
    importData: vi.fn(),
    clearAll: vi.fn(),
    getJSON: vi.fn(),
    setJSON: vi.fn(),
    removeItem: vi.fn(),
  },
}))

describe('StorageDebug', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(storageUtils.exportData as any).mockReturnValue({
      theme: 'dark',
      i18nextLng: 'en',
    })
  })

  it('renders storage debug button', () => {
    render(<StorageDebug />)
    expect(screen.getByRole('button', { name: /storage debug/i })).toBeInTheDocument()
  })

  it('shows storage data when opened', async () => {
    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    expect(screen.getByText('theme')).toBeInTheDocument()
    expect(screen.getByText('i18nextLng')).toBeInTheDocument()
  })

  it('handles export', async () => {
    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    const exportButton = screen.getByRole('button', { name: /export/i })
    await userEvent.click(exportButton)

    expect(storageUtils.exportData).toHaveBeenCalled()
  })

  it('handles import', async () => {
    const testData = { theme: 'light', i18nextLng: 'pt' }
    const file = new File([JSON.stringify(testData)], 'storage.json', { type: 'application/json' })

    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    const importButton = screen.getByRole('button', { name: /import/i })
    const input = screen.getByLabelText(/import/i)

    await userEvent.upload(input, file)
    await userEvent.click(importButton)

    expect(storageUtils.importData).toHaveBeenCalledWith(testData)
  })

  it('handles clear all', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    const clearButton = screen.getByRole('button', { name: /clear all/i })
    await userEvent.click(clearButton)

    expect(storageUtils.clearAll).toHaveBeenCalled()
  })

  it('handles delete item', async () => {
    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await userEvent.click(deleteButtons[0])

    expect(storageUtils.removeItem).toHaveBeenCalledWith('theme')
  })

  it('shows empty state', async () => {
    ;(storageUtils.exportData as any).mockReturnValue({})

    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    expect(screen.getByText(/no items/i)).toBeInTheDocument()
  })

  it('formats sizes correctly', async () => {
    ;(storageUtils.exportData as any).mockReturnValue({
      small: 'a'.repeat(100),
      medium: 'a'.repeat(1024),
      large: 'a'.repeat(1024 * 1024),
    })

    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    expect(screen.getByText('100 B')).toBeInTheDocument()
    expect(screen.getByText('1.0 KB')).toBeInTheDocument()
    expect(screen.getByText('1.0 MB')).toBeInTheDocument()
  })

  it('handles refresh', async () => {
    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    await userEvent.click(refreshButton)

    expect(storageUtils.exportData).toHaveBeenCalledTimes(2)
  })

  it('handles invalid JSON preview', async () => {
    const circularObj = { a: {} }
    circularObj.a = circularObj

    ;(storageUtils.exportData as any).mockReturnValue({
      circular: circularObj,
    })

    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    expect(screen.getByText(/invalid json/i)).toBeInTheDocument()
  })

  it('truncates long values in preview', async () => {
    ;(storageUtils.exportData as any).mockReturnValue({
      long: 'a'.repeat(1000),
    })

    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    const preview = screen.getByText(/\.{3}/i)
    expect(preview.textContent?.length).toBeLessThan(1000)
  })

  it('handles failed import', async () => {
    const file = new File(['invalid json'], 'storage.json', { type: 'application/json' })

    render(<StorageDebug />)

    const debugButton = screen.getByRole('button', { name: /storage debug/i })
    await userEvent.click(debugButton)

    const importButton = screen.getByRole('button', { name: /import/i })
    const input = screen.getByLabelText(/import/i)

    await userEvent.upload(input, file)
    await userEvent.click(importButton)

    expect(screen.getByText(/invalid json/i)).toBeInTheDocument()
  })
}) 