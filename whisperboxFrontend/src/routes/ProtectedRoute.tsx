import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

interface ProtectedRouteProps {
  /** Only users with this role can enter — others are redirected to /dashboard */
  requiredRole?: 'STUDENT' | 'ADMIN'
  /** Users with this role are blocked — redirected to /dashboard */
  blockedRole?: 'STUDENT' | 'ADMIN'
}

/**
 * ProtectedRoute
 *
 * Handles three cases:
 *   1. Not logged in              → redirect to /
 *   2. requiredRole doesn't match → redirect to /dashboard
 *   3. blockedRole matches        → redirect to /dashboard
 *
 * Examples:
 *   <ProtectedRoute requiredRole="ADMIN" />          — admin only
 *   <ProtectedRoute blockedRole="ADMIN" />           — everyone except admin
 *   <ProtectedRoute />                               — any logged-in user
 */
export default function ProtectedRoute({ requiredRole, blockedRole }: ProtectedRouteProps) {
  const { user, ready } = useAuth()

  // Still checking auth on startup — show spinner
  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    )
  }

  // Not logged in → go to landing
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Role is required and user doesn't have it → go to dashboard
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  // User's role is explicitly blocked on this route → go to dashboard
  if (blockedRole && user.role === blockedRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
