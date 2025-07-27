import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card } from '../../components/ui/card'
import { useToast } from '../../hooks/use-toast'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants'

export const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.'
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres.'
      })
      return
    }

    try {
      setLoading(true)
      await signUp(email, password)
      navigate(ROUTES.HOME)
    } catch (error: any) {
      let errorMessage = 'Falha ao criar conta. Tente novamente.'
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.'
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'O cadastro com email e senha está desabilitado.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca.'
      }

      toast({
        title: 'Erro',
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Criar Conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="password"
                required
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="password"
                required
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <RouterLink
                to={ROUTES.LOGIN}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Faça login
              </RouterLink>
            </span>
          </div>
        </form>
      </Card>
    </div>
  )
} 