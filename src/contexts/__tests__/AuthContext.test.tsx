import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../AuthContext'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(),
}))

const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
}

// Test component to access auth context
const TestComponent = () => {
  const auth = useAuth()
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="user">{auth.currentUser?.email || 'no user'}</div>
      <button onClick={() => auth.signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => auth.signUp('test@example.com', 'password')}>Sign Up</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(onAuthStateChanged as any).mockImplementation((auth, callback) => {
      callback(null)
      return vi.fn()
    })
  })

  it('should provide initial auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('no user')
  })

  it('should handle sign in', async () => {
    ;(signInWithEmailAndPassword as any).mockResolvedValueOnce({ user: mockUser })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signInButton = screen.getByText('Sign In')
    await act(async () => {
      await userEvent.click(signInButton)
    })

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password'
    )
  })

  it('should handle sign up', async () => {
    ;(createUserWithEmailAndPassword as any).mockResolvedValueOnce({ user: mockUser })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signUpButton = screen.getByText('Sign Up')
    await act(async () => {
      await userEvent.click(signUpButton)
    })

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password'
    )
  })

  it('should handle logout', async () => {
    ;(signOut as any).mockResolvedValueOnce()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const logoutButton = screen.getByText('Logout')
    await act(async () => {
      await userEvent.click(logoutButton)
    })

    expect(signOut).toHaveBeenCalled()
  })

  it('should update auth state when user changes', async () => {
    let authStateCallback: any
    ;(onAuthStateChanged as any).mockImplementation((auth, callback) => {
      authStateCallback = callback
      return vi.fn()
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user')).toHaveTextContent('no user')

    await act(async () => {
      authStateCallback(mockUser)
    })

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email)
    })
  })

  it('should handle sign in error', async () => {
    const error = new Error('Invalid credentials')
    ;(signInWithEmailAndPassword as any).mockRejectedValueOnce(error)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signInButton = screen.getByText('Sign In')
    await act(async () => {
      await userEvent.click(signInButton)
    })

    expect(signInWithEmailAndPassword).toHaveBeenCalled()
  })

  it('should handle sign up error', async () => {
    const error = new Error('Email already in use')
    ;(createUserWithEmailAndPassword as any).mockRejectedValueOnce(error)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signUpButton = screen.getByText('Sign Up')
    await act(async () => {
      await userEvent.click(signUpButton)
    })

    expect(createUserWithEmailAndPassword).toHaveBeenCalled()
  })

  it('should handle logout error', async () => {
    const error = new Error('Logout failed')
    ;(signOut as any).mockRejectedValueOnce(error)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const logoutButton = screen.getByText('Logout')
    await act(async () => {
      await userEvent.click(logoutButton)
    })

    expect(signOut).toHaveBeenCalled()
  })
}) 