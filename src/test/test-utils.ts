import type { ReactElement } from 'react'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { AllTheProviders } from './providers'

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock Firebase Auth User
export const mockAuthUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: vi.fn(),
  getIdToken: vi.fn(),
  getIdTokenResult: vi.fn(),
  reload: vi.fn(),
  toJSON: vi.fn(),
  displayName: null,
  phoneNumber: null,
  photoURL: null,
  providerId: 'firebase',
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