import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import { CadastroAluno } from '..'
import { useAlunosStore } from '../../../stores/alunos'

vi.mock('../../../stores/alunos', () => ({
  useAlunosStore: vi.fn(),
  selectLoading: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('CadastroAluno', () => {
  const mockStore = {
    addAluno: vi.fn(),
    loading: false,
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

  it('renders cadastro form', () => {
    render(<CadastroAluno />)

    expect(screen.getByText('students.form.title')).toBeInTheDocument()
    expect(screen.getByText('Preencha os dados para cadastrar um novo aluno')).toBeInTheDocument()
    expect(screen.getByLabelText('students.form.name.label')).toBeInTheDocument()
    expect(screen.getByLabelText('students.form.age.label')).toBeInTheDocument()
  })

  it('handles successful form submission', async () => {
    mockStore.addAluno.mockResolvedValueOnce()

    render(<CadastroAluno />)

    const nameInput = screen.getByLabelText('students.form.name.label')
    const ageInput = screen.getByLabelText('students.form.age.label')
    const submitButton = screen.getByText('students.form.submit')

    await userEvent.type(nameInput, 'João Silva')
    await userEvent.type(ageInput, '20')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockStore.addAluno).toHaveBeenCalledWith({
        nome: 'João Silva',
        idade: 20,
      })
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('handles form submission error', async () => {
    const error = new Error('Failed to add student')
    mockStore.addAluno.mockRejectedValueOnce(error)

    render(<CadastroAluno />)

    const nameInput = screen.getByLabelText('students.form.name.label')
    const ageInput = screen.getByLabelText('students.form.age.label')
    const submitButton = screen.getByText('students.form.submit')

    await userEvent.type(nameInput, 'João Silva')
    await userEvent.type(ageInput, '20')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(error.message)).toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  it('disables form when loading', () => {
    ;(useAlunosStore as any).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ ...mockStore, loading: true })
      }
      return { ...mockStore, loading: true }[selector]
    })

    render(<CadastroAluno />)

    expect(screen.getByLabelText('students.form.name.label')).toBeDisabled()
    expect(screen.getByLabelText('students.form.age.label')).toBeDisabled()
    expect(screen.getByText('students.form.submit')).toBeDisabled()
  })

  it('shows generic error message for unknown errors', async () => {
    mockStore.addAluno.mockRejectedValueOnce('Unknown error')

    render(<CadastroAluno />)

    const nameInput = screen.getByLabelText('students.form.name.label')
    const ageInput = screen.getByLabelText('students.form.age.label')
    const submitButton = screen.getByText('students.form.submit')

    await userEvent.type(nameInput, 'João Silva')
    await userEvent.type(ageInput, '20')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Erro ao cadastrar aluno')).toBeInTheDocument()
    })
  })

  it('shows success message after successful submission', async () => {
    mockStore.addAluno.mockResolvedValueOnce()

    render(<CadastroAluno />)

    const nameInput = screen.getByLabelText('students.form.name.label')
    const ageInput = screen.getByLabelText('students.form.age.label')
    const submitButton = screen.getByText('students.form.submit')

    await userEvent.type(nameInput, 'João Silva')
    await userEvent.type(ageInput, '20')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('students.form.successMessage')).toBeInTheDocument()
    })
  })

  it('validates form before submission', async () => {
    render(<CadastroAluno />)

    const submitButton = screen.getByText('students.form.submit')
    await userEvent.click(submitButton)

    expect(mockStore.addAluno).not.toHaveBeenCalled()
  })
}) 