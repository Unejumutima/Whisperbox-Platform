import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TOKEN_KEY } from '../utils/constants'
import LoadingSpinner from '../components/ui/LoadingSpinner'

/**
 * Handles the redirect from Spring Boot after Google OAuth2 login.
 * Reads ?token= from URL, persists it, then navigates to the dashboard.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')

    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <LoadingSpinner size="lg" label="Authenticating with Google…" />
    </div>
  )
}
