import type { ReactElement } from 'react'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '../contexts/ThemeContext'
import { AuthProvider } from '../contexts/auth'
import { ToastProvider } from '../components/ui/toast'
import { TooltipProvider } from '../components/ui/tooltip'
import { vi } from 'vitest'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>{children}</AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock Firebase Auth User
export const mockAuthUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  emailVerified: true,
}

// Mock Firebase Auth Context
export const mockAuthContext = {
  currentUser: mockAuthUser,
  loading: false,
  signUp: vi.fn(),
  signIn: vi.fn(),
  logout: vi.fn(),
}

export * from '@testing-library/react'
export { customRender as render } 