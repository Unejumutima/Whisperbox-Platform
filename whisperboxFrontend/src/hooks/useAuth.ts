import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * useAuth — the only hook components should use to access auth state.
 *
 * Returns: { user, loading, ready, login, logout }
 *
 * Usage:
 *   const { user, logout } = useAuth()
 *   const { user, loading } = useAuth()
 *
 * Throws if called outside of <AuthProvider> — this catches wiring mistakes early.
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth must be used inside <AuthProvider>. Check your App.tsx.')
  }

  return context
}
