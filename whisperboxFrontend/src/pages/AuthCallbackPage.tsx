import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'


export default function AuthCallbackPage() {
  const navigate  = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const token  = params.get('token')

      // No token in URL — something went wrong on the backend side
      if (!token) {
        navigate('/', { replace: true })
        return
      }

      try {
        // Save token + fetch user profile via AuthContext
        await login(token)
        navigate('/dashboard', { replace: true })
      } catch {
        setError('Authentication failed. Please try again.')
        setTimeout(() => navigate('/', { replace: true }), 2500)
      }
    }

    handleCallback()
  }, [login, navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="glass p-8 text-center max-w-sm">
          <p className="text-red-400 font-medium mb-2">Authentication Failed</p>
          <p className="text-white/40 text-sm">{error}</p>
          <p className="text-white/25 text-xs mt-3">Redirecting you back…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <LoadingSpinner size="lg" label="Signing you in…" />
    </div>
  )
}
