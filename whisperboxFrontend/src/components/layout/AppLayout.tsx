import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'

/**
 * AppLayout — shared shell for all authenticated pages.
 *
 * Reads the real user from AuthContext so Navbar and Sidebar
 * show the actual anonymous name, email, and role.
 */
export default function AppLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar anonymousName={user?.anonymousName} />

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
