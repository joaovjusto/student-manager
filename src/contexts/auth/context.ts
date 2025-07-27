import { createContext } from 'react'
import type { User } from 'firebase/auth'

export interface AuthContextType {
  currentUser: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null) 