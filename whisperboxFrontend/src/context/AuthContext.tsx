import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, isLoggedIn, logout as clearToken } from '../services/authService'
import type { UserInfo } from '../services/authService'

// ─────────────────────────────────────────────────────────────────────────────
// Shape of everything the context exposes to the rest of the app
// ─────────────────────────────────────────────────────────────────────────────
interface AuthContextValue {
  /** The logged-in user, or null if not authenticated */
  user: UserInfo | null
  /** True while the initial auth check is running on app load */
  loading: boolean
  /** True after the first auth check has completed */
  ready: boolean
  /** Call this after receiving a JWT from the OAuth2 callback */
  login: (token: string) => Promise<void>
  /** Clears the token and user from memory */
  logout: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Create the context — the default value is only used if a component tries to
// use useAuth() outside of <AuthProvider>. We throw to catch that mistake early.
// ─────────────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

// ─────────────────────────────────────────────────────────────────────────────
// AuthProvider — wraps the entire app in App.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)   // true during initial check
  const [ready,   setReady]   = useState(false)  // true once check is done

  // ── On app load: if a token exists, fetch the user profile ───────────────
  useEffect(() => {
    const initialCheck = async () => {
      if (!isLoggedIn()) {
        // No token at all — skip the network call
        setLoading(false)
        setReady(true)
        return
      }

      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch {
        // Token in localStorage is expired or invalid — clear it
        clearToken()
        setUser(null)
      } finally {
        setLoading(false)
        setReady(true)
      }
    }

    initialCheck()
  }, [])

  // ── login: called by AuthCallbackPage after receiving the JWT ────────────
  const login = async (token: string): Promise<void> => {
    // 1. Persist the token so the Axios interceptor picks it up
    localStorage.setItem('whisperbox_token', token)

    // 2. Fetch the user's profile with the new token
    const userData = await getCurrentUser()
    setUser(userData)
  }

  // ── logout: clears token and user from memory ────────────────────────────
  const logout = (): void => {
    clearToken()
    setUser(null)
  }

  const value: AuthContextValue = { user, loading, ready, login, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Export the raw context for the useAuth hook
// ─────────────────────────────────────────────────────────────────────────────
export { AuthContext }
