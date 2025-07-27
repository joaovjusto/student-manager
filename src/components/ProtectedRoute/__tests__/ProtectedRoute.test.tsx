import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import { ProtectedRoute } from '..'
import { useAuth } from '../../../hooks/useAuth'
import { mockAuthContext } from '../../../test/test-utils'
import type { AuthContextType } from '../../../contexts/auth'

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(() => null),
  useNavigate: () => vi.fn(),
}))

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when user is authenticated', () => {
    ;(useAuth as Mock).mockReturnValue({
      ...mockAuthContext,
      currentUser: { uid: '123', email: 'test@example.com' },
    })

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    ;(useAuth as Mock).mockReturnValue({
      ...mockAuthContext,
      currentUser: null,
    })

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('handles undefined user state', () => {
    ;(useAuth as Mock).mockReturnValue({
      ...mockAuthContext,
      currentUser: null,
    })

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders nested components when authenticated', () => {
    ;(useAuth as Mock).mockReturnValue({
      ...mockAuthContext,
      currentUser: { uid: '123', email: 'test@example.com' },
    })

    render(
      <ProtectedRoute>
        <div>
          <TestComponent />
          <span>Additional Content</span>
        </div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    expect(screen.getByText('Additional Content')).toBeInTheDocument()
  })
}) 