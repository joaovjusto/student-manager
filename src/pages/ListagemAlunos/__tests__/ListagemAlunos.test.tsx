import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import { ListagemAlunos } from '..'
import { useAlunosStore } from '../../../stores/alunos'

vi.mock('../../../stores/alunos', () => ({
  useAlunosStore: vi.fn(),
  selectAlunos: vi.fn(),
  selectLoading: vi.fn(),
  selectError: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('ListagemAlunos', () => {
  const mockAlunos = [
    { id: '1', nome: 'João Silva', idade: 20 },
    { id: '2', nome: 'Maria Santos', idade: 22 },
  ]

  const mockStore = {
    alunos: mockAlunos,
    loading: false,
    error: null,
    deleteAluno: vi.fn(),
    refresh: vi.fn(),
    clearError: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAlunosStore as any).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore)
      }
      return mockStore[selector]
    })
  })

  it('renders list of students', () => {
    render(<ListagemAlunos />)

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('20 students.list.years')).toBeInTheDocument()
    expect(screen.getByText('22 students.list.years')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    ;(useAlunosStore as any).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ ...mockStore, loading: true, alunos: [] })
      }
      return { ...mockStore, loading: true, alunos: [] }[selector]
    })

    render(<ListagemAlunos />)
    expect(screen.getByText('Carregando dados...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    const error = 'Failed to load students'
    ;(useAlunosStore as any).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ ...mockStore, error })
      }
      return { ...mockStore, error }[selector]
    })

    render(<ListagemAlunos />)
    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument()
    expect(screen.getByText(error)).toBeInTheDocument()
  })

  it('shows empty state', () => {
    ;(useAlunosStore as any).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ ...mockStore, alunos: [] })
      }
      return { ...mockStore, alunos: [] }[selector]
    })

    render(<ListagemAlunos />)
    expect(screen.getByText('students.list.empty')).toBeInTheDocument()
  })

  it('handles refresh', async () => {
    render(<ListagemAlunos />)

    const refreshButton = screen.getByRole('button', { name: /atualizar/i })
    await userEvent.click(refreshButton)

    expect(mockStore.refresh).toHaveBeenCalled()
  })

  it('handles delete confirmation', async () => {
    render(<ListagemAlunos />)

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await userEvent.click(deleteButtons[0])

    const confirmButton = screen.getByRole('button', { name: /common.delete/i })
    await userEvent.click(confirmButton)

    expect(mockStore.deleteAluno).toHaveBeenCalledWith('1')
  })

  it('handles delete cancellation', async () => {
    render(<ListagemAlunos />)

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await userEvent.click(deleteButtons[0])

    const cancelButton = screen.getByRole('button', { name: /common.cancel/i })
    await userEvent.click(cancelButton)

    expect(mockStore.deleteAluno).not.toHaveBeenCalled()
  })

  it('handles edit click', async () => {
    render(<ListagemAlunos />)

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    await userEvent.click(editButtons[0])

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('navigates to cadastro page', async () => {
    render(<ListagemAlunos />)

    const newButton = screen.getByRole('button', { name: /novo aluno/i })
    await userEvent.click(newButton)

    expect(mockNavigate).toHaveBeenCalledWith('/cadastro')
  })

  it('handles error clearing', async () => {
    const error = 'Failed to load students'
    ;(useAlunosStore as any).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ ...mockStore, error })
      }
      return { ...mockStore, error }[selector]
    })

    render(<ListagemAlunos />)

    const clearButton = screen.getByRole('button', { name: /limpar erro/i })
    await userEvent.click(clearButton)

    expect(mockStore.clearError).toHaveBeenCalled()
  })

  it('disables buttons while loading', () => {
    ;(useAlunosStore as any).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ ...mockStore, loading: true })
      }
      return { ...mockStore, loading: true }[selector]
    })

    render(<ListagemAlunos />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('shows correct student count', () => {
    render(<ListagemAlunos />)

    expect(screen.getByText('students.list.count', { exact: false })).toBeInTheDocument()
  })

  it('handles failed delete operation', async () => {
    mockStore.deleteAluno.mockRejectedValueOnce(new Error('Failed to delete'))

    render(<ListagemAlunos />)

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await userEvent.click(deleteButtons[0])

    const confirmButton = screen.getByRole('button', { name: /common.delete/i })
    await userEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText('Erro ao deletar aluno')).toBeInTheDocument()
    })
  })

  it('handles failed refresh operation', async () => {
    mockStore.refresh.mockRejectedValueOnce(new Error('Failed to refresh'))

    render(<ListagemAlunos />)

    const refreshButton = screen.getByRole('button', { name: /atualizar/i })
    await userEvent.click(refreshButton)

    await waitFor(() => {
      expect(screen.getByText('Falha ao atualizar dados')).toBeInTheDocument()
    })
  })
}) 