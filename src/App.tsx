import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { ToastProvider, ToastViewport } from './components/ui/toast'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/toaster'
import { StorageDebug } from './components/StorageDebug'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { TopBar } from './components/TopBar'
import { ListagemAlunos } from './pages/ListagemAlunos'
import { CadastroAluno } from './pages/CadastroAluno'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { useFirebaseStore } from './hooks/useFirebaseStore'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { ROUTES } from './constants'
import './i18n'
import './index.css'

function RootLayout() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <ToastProvider>
          <AuthProvider>
            <Outlet />
            <Toaster />
            <ToastViewport />
            {import.meta.env.DEV && <StorageDebug />}
          </AuthProvider>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

function AppLayout() {
  useFirebaseStore()
  useDocumentTitle()

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-spotify-base">
      <TopBar />
      <main className="flex-1 overflow-auto">
        <div className="page-container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Login />
      },
      {
        path: ROUTES.SIGNUP,
        element: <Signup />
      },
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ROUTES.HOME,
            element: <ListagemAlunos />
          },
          {
            path: ROUTES.CADASTRO,
            element: <CadastroAluno />
          }
        ]
      }
    ]
  }
], {
  future: {
    v7_startTransition: true
  }
})

function App() {
  return (
    <RouterProvider 
      router={router} 
      future={{
        v7_startTransition: true
      }}
    />
  )
}

export default App