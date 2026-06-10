import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthProvider }      from './context/AuthContext'
import ProtectedRoute        from './routes/ProtectedRoute'
import AppLayout             from './components/layout/AppLayout'

import LandingPage           from './pages/LandingPage'
import AuthCallbackPage      from './pages/AuthCallbackPage'
import DashboardPage         from './pages/DashboardPage'
import FeedPage              from './pages/FeedPage'
import CreateWhisperPage     from './pages/CreateWhisperPage'
import ProfilePage           from './pages/ProfilePage'
import AdminPage             from './pages/AdminPage'

function App() {
  return (
    // AuthProvider must wrap BrowserRouter so ProtectedRoute can read auth state
    <AuthProvider>
      <BrowserRouter>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',   // slate-900
              color:      '#e0f2fe',   // sky-100
              border:     '1px solid rgba(14, 165, 233, 0.25)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#38bdf8', secondary: '#0f172a' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#0f172a' } },
          }}
        />

        <Routes>
          {/* ── Public routes (no auth required) ─────────────────────── */}
          <Route path="/"              element={<LandingPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* ── Authenticated routes — guarded by ProtectedRoute ──────── */}
          {/* AppLayout provides Navbar + Sidebar + <Outlet /> */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/feed"      element={<FeedPage />} />
              <Route path="/create"    element={<CreateWhisperPage />} />
              <Route path="/profile"   element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ── Admin-only route ──────────────────────────────────────── */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
