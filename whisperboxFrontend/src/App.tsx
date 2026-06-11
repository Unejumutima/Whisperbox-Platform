import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthProvider }   from './context/AuthContext'
import ProtectedRoute     from './routes/ProtectedRoute'
import AppLayout          from './components/layout/AppLayout'

// Public
import LandingPage        from './pages/LandingPage'
import AuthCallbackPage   from './pages/AuthCallbackPage'

// Shared (both roles)
import DashboardPage      from './pages/DashboardPage'
import ProfilePage        from './pages/ProfilePage'

// Student-only
import FeedPage           from './pages/FeedPage'
import CreateWhisperPage  from './pages/CreateWhisperPage'
import MyWhispersPage     from './pages/MyWhispersPage'

// Admin-only
import AdminPage          from './pages/AdminPage'
import UserManagementPage from './pages/UserManagementPage'

/**
 * App — root routing configuration.
 *
 * Route groups:
 *   Public         → no auth required
 *   Student-only   → authenticated + blockedRole="ADMIN"
 *   Admin-only     → authenticated + requiredRole="ADMIN"
 *   Shared         → any authenticated user
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color:      '#e0f2fe',
              border:     '1px solid rgba(14, 165, 233, 0.25)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#38bdf8', secondary: '#0f172a' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#0f172a' } },
          }}
        />

        <Routes>
          {/* ── Public ────────────────────────────────────────────────── */}
          <Route path="/"              element={<LandingPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* ── Shared (any authenticated user) ──────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile"   element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ── Student-only (admin is blocked) ──────────────────────── */}
          <Route element={<ProtectedRoute blockedRole="ADMIN" />}>
            <Route element={<AppLayout />}>
              <Route path="/feed"         element={<FeedPage />} />
              <Route path="/create"       element={<CreateWhisperPage />} />
              <Route path="/my-whispers"  element={<MyWhispersPage />} />
            </Route>
          </Route>

          {/* ── Admin-only ────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route element={<AppLayout />}>
              <Route path="/admin"       element={<AdminPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
