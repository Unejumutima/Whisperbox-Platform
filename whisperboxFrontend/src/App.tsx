import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import AppLayout          from './components/layout/AppLayout'
import LandingPage        from './pages/LandingPage'
import AuthCallbackPage   from './pages/AuthCallbackPage'
import DashboardPage      from './pages/DashboardPage'
import FeedPage           from './pages/FeedPage'
import CreateWhisperPage  from './pages/CreateWhisperPage'
import ProfilePage        from './pages/ProfilePage'
import AdminPage          from './pages/AdminPage'

function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1b4b',
            color: '#e0e7ff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#a78bfa', secondary: '#1e1b4b' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#1e1b4b' } },
        }}
      />

      <Routes>
        {/* ── Public routes ───────────────────────────────────────────── */}
        <Route path="/"              element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* ── Authenticated routes — all share AppLayout ───────────── */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/feed"      element={<FeedPage />} />
          <Route path="/create"    element={<CreateWhisperPage />} />
          <Route path="/profile"   element={<ProfilePage />} />
          <Route path="/admin"     element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
