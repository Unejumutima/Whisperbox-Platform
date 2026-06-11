import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'

/**
 * AppLayout — shared shell for all authenticated pages.
 * Passes real user data from AuthContext to Navbar and Sidebar.
 * Both components handle null anonymousName safely (admin case).
 */
export default function AppLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar
        anonymousName={user?.anonymousName}
        role={user?.role}
      />

      <div className="flex flex-1 pt-16">
        <Sidebar
          anonymousName={user?.anonymousName}
          email={user?.email}
          isAdmin={user?.role === 'ADMIN'}
        />
        <main className="flex-1 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
