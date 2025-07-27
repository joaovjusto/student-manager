import { vi, describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import { AlunoForm } from '..'

describe('AlunoForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  }

  it('renders empty form correctly', () => {
    render(<AlunoForm {...defaultProps} />)

    expect(screen.getByRole('textbox', { name: /students\.form\.name\.label/i })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: /students\.form\.age\.label/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /students\.form\.submit/i })).toBeInTheDocument()
  })

  it('renders form with initial values', () => {
    const aluno = {
      id: '1',
      name: 'João Silva',
      age: 20,
    }

    render(<AlunoForm {...defaultProps} aluno={aluno} />)

    expect(screen.getByRole('textbox', { name: /students\.form\.name\.label/i })).toHaveValue('João Silva')
    expect(screen.getByRole('spinbutton', { name: /students\.form\.age\.label/i })).toHaveValue(20)
  })

  it('handles form submission with valid data', async () => {
    render(<AlunoForm {...defaultProps} />)

    const nameInput = screen.getByRole('textbox', { name: /students\.form\.name\.label/i })
    const ageInput = screen.getByRole('spinbutton', { name: /students\.form\.age\.label/i })
    const submitButton = screen.getByRole('button', { name: /students\.form\.submit/i })

    await userEvent.type(nameInput, 'João Silva')
    await userEvent.type(ageInput, '20')
    await userEvent.click(submitButton)

    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      name: 'João Silva',
      age: 20,
    })
  })

  it('disables submit button when name is empty', () => {
    render(<AlunoForm {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /students\.form\.submit/i })
    expect(submitButton).toBeDisabled()
  })

  it('handles form cancellation', async () => {
    render(<AlunoForm {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: /common\.cancel/i })
    await userEvent.click(cancelButton)

    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    const slowSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<AlunoForm {...defaultProps} onSubmit={slowSubmit} />)

    const nameInput = screen.getByRole('textbox', { name: /students\.form\.name\.label/i })
    const ageInput = screen.getByRole('spinbutton', { name: /students\.form\.age\.label/i })
    const submitButton = screen.getByRole('button', { name: /students\.form\.submit/i })

    await userEvent.type(nameInput, 'João Silva')
    await userEvent.type(ageInput, '20')
    await userEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(nameInput).toBeDisabled()
    expect(ageInput).toBeDisabled()

    await waitFor(() => {
      expect(slowSubmit).toHaveBeenCalled()
    })
  })

  it('clears form after successful submission for new aluno', async () => {
    render(<AlunoForm {...defaultProps} />)

    const nameInput = screen.getByRole('textbox', { name: /students\.form\.name\.label/i })
    const ageInput = screen.getByRole('spinbutton', { name: /students\.form\.age\.label/i })
    const submitButton = screen.getByRole('button', { name: /students\.form\.submit/i })

    await userEvent.type(nameInput, 'João Silva')
    await userEvent.type(ageInput, '20')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(nameInput).toHaveValue('')
      expect(ageInput).toHaveValue(null)
    })
  })

  it('maintains form data after successful submission for existing aluno', async () => {
    const aluno = {
      id: '1',
      name: 'João Silva',
      age: 20,
    }

    render(<AlunoForm {...defaultProps} aluno={aluno} />)

    const nameInput = screen.getByRole('textbox', { name: /students\.form\.name\.label/i })
    const ageInput = screen.getByRole('spinbutton', { name: /students\.form\.age\.label/i })
    const submitButton = screen.getByRole('button', { name: /students\.form\.submit/i })

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'João Silva Updated')
    await userEvent.clear(ageInput)
    await userEvent.type(ageInput, '21')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(nameInput).toHaveValue('João Silva Updated')
      expect(ageInput).toHaveValue(21)
    })
  })

  it('validates age input range', async () => {
    render(<AlunoForm {...defaultProps} />)

    const ageInput = screen.getByRole('spinbutton', { name: /students\.form\.age\.label/i }) as HTMLInputElement

    await userEvent.type(ageInput, '200')
    expect(ageInput.validity.valid).toBe(false)

    await userEvent.clear(ageInput)
    await userEvent.type(ageInput, '50')
    expect(ageInput.validity.valid).toBe(true)
  })

  it('handles disabled state', () => {
    render(<AlunoForm {...defaultProps} disabled={true} />)

    expect(screen.getByRole('textbox', { name: /students\.form\.name\.label/i })).toBeDisabled()
    expect(screen.getByRole('spinbutton', { name: /students\.form\.age\.label/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /students\.form\.submit/i })).toBeDisabled()
  })
}) 