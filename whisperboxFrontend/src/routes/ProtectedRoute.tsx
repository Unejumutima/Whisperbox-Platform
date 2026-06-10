import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

interface ProtectedRouteProps {
  /** If provided, only users with this role can enter. Others get redirected. */
  requiredRole?: 'STUDENT' | 'ADMIN'
}

/**
 * ProtectedRoute — guards any route that requires authentication.
 *
 * Behaviour:
 *   1. While auth is still loading (app startup), show a spinner.
 *   2. If the user is not logged in, redirect to the landing page (/).
 *   3. If a requiredRole is set and the user's role doesn't match, redirect to /dashboard.
 *   4. Otherwise, render the child route via <Outlet />.
 *
 * Usage in App.tsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
 *     <Route path="/admin" element={<AdminPage />} />
 *   </Route>
 */
export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, ready } = useAuth()

  // Still running the initial auth check — show a full-screen spinner
  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    )
  }

  // No user → send to landing page
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Wrong role → send to dashboard
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  // All checks passed — render the child route
  return <Outlet />
}
