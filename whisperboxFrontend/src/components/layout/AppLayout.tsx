import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

/**
 * Shared layout for all authenticated pages.
 * Structure: fixed Navbar on top, Sidebar on the left, page content via <Outlet />.
 * pt-16 offsets the fixed navbar.
 *
 * In a future phase, anonymousName/email/isAdmin will come from AuthContext.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar anonymousName="Silent Panda" />

      <div className="flex flex-1 pt-16">
        <Sidebar
          anonymousName="Silent Panda"
          email="student@school.edu"
          isAdmin={false}
        />
        <main className="flex-1 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
