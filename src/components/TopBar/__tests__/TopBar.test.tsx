import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import { TopBar } from '..'
import { mockAuthContext } from '../../../test/test-utils'
import { useAuth } from '../../../hooks/useAuth'

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('TopBar', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuth as any).mockReturnValue(mockAuthContext)
    vi.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
      useLocation: () => ({ pathname: '/' }),
    }))
  })

  it('renders correctly', () => {
    render(<TopBar />)
    
    expect(screen.getByText('students.list.title')).toBeInTheDocument()
    expect(screen.getByText('students.form.title')).toBeInTheDocument()
  })

  it('handles theme toggle', async () => {
    render(<TopBar />)
    
    const themeButton = screen.getByRole('button', { name: /theme/i })
    await userEvent.click(themeButton)
    
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument()
  })

  it('handles mobile menu toggle', async () => {
    render(<TopBar />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    await userEvent.click(menuButton)
    
    expect(screen.getByText('students.list.title')).toBeInTheDocument()
    expect(screen.getByText('students.form.title')).toBeInTheDocument()
  })

  it('handles navigation', async () => {
    render(<TopBar />)
    
    const listButton = screen.getByText('students.list.title')
    await userEvent.click(listButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('handles logout', async () => {
    render(<TopBar />)
    
    const logoutButton = screen.getByRole('button', { name: /sair/i })
    await userEvent.click(logoutButton)
    
    await waitFor(() => {
      expect(mockAuthContext.logout).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('shows active state for current route', () => {
    vi.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
      useLocation: () => ({ pathname: '/cadastro' }),
    }))

    render(<TopBar />)
    
    const cadastroButton = screen.getByText('students.form.title')
    expect(cadastroButton.closest('button')).toHaveClass('bg-primary')
  })

  it('handles mobile menu close on navigation', async () => {
    render(<TopBar />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    await userEvent.click(menuButton)
    
    const listButton = screen.getByText('students.list.title')
    await userEvent.click(listButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
}) 