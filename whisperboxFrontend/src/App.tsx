import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Pages will be imported here as they are built
// import LandingPage from './pages/LandingPage'
// import DashboardPage from './pages/DashboardPage'
// import WhisperFeedPage from './pages/WhisperFeedPage'
// import CreateWhisperPage from './pages/CreateWhisperPage'
// import ProfilePage from './pages/ProfilePage'
// import AdminPage from './pages/AdminPage'
// import AuthCallbackPage from './pages/AuthCallbackPage'

// Context providers will wrap the app
// import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    // AuthProvider will wrap BrowserRouter once context is built
    <BrowserRouter>
      {/* Global toast notifications — positioned top-right */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1b4b',   // indigo-950
            color: '#e0e7ff',         // indigo-100
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#a78bfa', secondary: '#1e1b4b' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#1e1b4b' } },
        }}
      />

      <Routes>
        {/* Routes will be added here as pages are built */}
        <Route path="/" element={<div className="flex items-center justify-center min-h-screen gradient-text text-4xl font-bold">Whisperbox ✦ Setup Complete</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
