import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import { MobileStudentList } from '..'
import { useAlunosStore } from '../../../stores/alunos'

vi.mock('../../../stores/alunos', () => ({
  useAlunosStore: vi.fn(),
}))

describe('MobileStudentList', () => {
  const mockAlunos = [
    { id: '1', nome: 'João Silva', idade: 20 },
    { id: '2', nome: 'Maria Santos', idade: 22 },
  ]

  const mockActions = {
    deleteAluno: vi.fn(),
    setEditingAluno: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    clearError: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAlunosStore as any).mockReturnValue({
      alunos: mockAlunos,
      loading: false,
      error: null,
      ...mockActions,
    })
  })

  it('renders list of students', () => {
    render(<MobileStudentList />)

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('20 students.list.years')).toBeInTheDocument()
    expect(screen.getByText('22 students.list.years')).toBeInTheDocument()
  })

  it('shows loading skeleton', () => {
    ;(useAlunosStore as any).mockReturnValue({
      alunos: [],
      loading: true,
      error: null,
      ...mockActions,
    })

    render(<MobileStudentList />)

    const skeletons = screen.getAllByTestId('student-skeleton')
    expect(skeletons).toHaveLength(3)
  })

  it('handles delete confirmation', async () => {
    render(<MobileStudentList />)

    const deleteButtons = screen.getAllByRole('button', { name: /common\.delete/i })
    await userEvent.click(deleteButtons[0])

    const confirmButton = screen.getByRole('button', { name: /common\.confirm/i })
    await userEvent.click(confirmButton)

    expect(mockActions.deleteAluno).toHaveBeenCalledWith('1')
  })

  it('handles delete cancellation', async () => {
    render(<MobileStudentList />)

    const deleteButtons = screen.getAllByRole('button', { name: /common\.delete/i })
    await userEvent.click(deleteButtons[0])

    const cancelButton = screen.getByRole('button', { name: /common\.cancel/i })
    await userEvent.click(cancelButton)

    expect(mockActions.deleteAluno).not.toHaveBeenCalled()
  })

  it('handles edit click', async () => {
    render(<MobileStudentList />)

    const editButtons = screen.getAllByRole('button', { name: /common\.edit/i })
    await userEvent.click(editButtons[0])

    expect(mockActions.setEditingAluno).toHaveBeenCalledWith(mockAlunos[0])
  })

  it('disables buttons while loading', () => {
    ;(useAlunosStore as any).mockReturnValue({
      alunos: mockAlunos,
      loading: true,
      error: null,
      ...mockActions,
    })

    render(<MobileStudentList />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('shows success message after delete', async () => {
    render(<MobileStudentList />)

    const deleteButtons = screen.getAllByRole('button', { name: /common\.delete/i })
    await userEvent.click(deleteButtons[0])

    const confirmButton = screen.getByRole('button', { name: /common\.confirm/i })
    await userEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockActions.deleteAluno).toHaveBeenCalledWith('1')
    })
  })

  it('shows error message on delete failure', async () => {
    mockActions.deleteAluno.mockRejectedValueOnce(new Error('Failed to delete'))

    render(<MobileStudentList />)

    const deleteButtons = screen.getAllByRole('button', { name: /common\.delete/i })
    await userEvent.click(deleteButtons[0])

    const confirmButton = screen.getByRole('button', { name: /common\.confirm/i })
    await userEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockActions.setError).toHaveBeenCalledWith('Failed to delete')
    })
  })

  it('shows generic error message for unknown delete errors', async () => {
    mockActions.deleteAluno.mockRejectedValueOnce(new Error())

    render(<MobileStudentList />)

    const deleteButtons = screen.getAllByRole('button', { name: /common\.delete/i })
    await userEvent.click(deleteButtons[0])

    const confirmButton = screen.getByRole('button', { name: /common\.confirm/i })
    await userEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockActions.setError).toHaveBeenCalledWith('errors.unknown')
    })
  })

  it('closes modals when clicking outside', async () => {
    render(<MobileStudentList />)

    // Open edit modal
    const editButtons = screen.getAllByRole('button', { name: /common\.edit/i })
    await userEvent.click(editButtons[0])

    // Click outside
    await userEvent.click(document.body)

    expect(mockActions.setEditingAluno).toHaveBeenCalledWith(null)
  })
}) 