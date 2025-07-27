import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider, ToastViewport } from './components/ui/toast'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/toaster'
import { StorageDebug } from './components/StorageDebug'
import { ThemeProvider } from './contexts/ThemeContext'
import { TopBar } from './components/TopBar'
import { ListagemAlunos } from './pages/ListagemAlunos'
import { CadastroAluno } from './pages/CadastroAluno'
import { ROUTES } from './constants'
import './i18n'
import './index.css'

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
              <TopBar />
              <main className="flex-1 overflow-auto">
                <div className="page-container py-6">
                  <Routes>
                    <Route path={ROUTES.HOME} element={<ListagemAlunos />} />
                    <Route path={ROUTES.CADASTRO} element={<CadastroAluno />} />
                  </Routes>
                </div>
              </main>
            </div>
            <Toaster />
            <ToastViewport />
            {import.meta.env.DEV && <StorageDebug />}
          </BrowserRouter>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App