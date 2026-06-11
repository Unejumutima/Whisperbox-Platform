import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { HiMenuAlt3, HiX, HiShieldCheck } from 'react-icons/hi'
import clsx from 'clsx'

interface NavbarProps {
  anonymousName?: string | null
  role?: string | null
}

// ── Role-specific top nav links ───────────────────────────────────────────
const studentLinks = [
  { label: 'Feed',         to: '/feed'         },
  { label: 'Create',       to: '/create'        },
  { label: 'My Whispers',  to: '/my-whispers'   },
  { label: 'Profile',      to: '/profile'       },
]

const adminLinks = [
  { label: 'All Whispers', to: '/admin'        },
  { label: 'Users',        to: '/admin/users'  },
  { label: 'Profile',      to: '/profile'      },
]

/**
 * Navbar — fixed top bar, role-aware.
 *
 * Students see: Feed | Create | My Whispers | Profile
 * Admins see:   All Whispers | Users | Profile
 *
 * Avatar: violet shield for admin, sky initial for student.
 */
export default function Navbar({ anonymousName, role }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const isAdmin  = role === 'ADMIN'
  const links    = isAdmin ? adminLinks : studentLinks

  // Safe initial calculation
  const initial = anonymousName
    ? anonymousName.charAt(0).toUpperCase()
    : isAdmin ? 'A' : 'W'

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    clsx('text-sm font-medium transition-colors duration-200 px-1 py-0.5', {
      'text-sky-400':                   isActive,
      'text-white/50 hover:text-white': !isActive,
    })

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="gradient-text font-bold text-xl tracking-tight select-none">
          ✦ Whisperbox
        </Link>

        {/* Desktop nav — role-specific links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls}>{l.label}</NavLink>
          ))}

          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold select-none ${
            isAdmin
              ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
              : 'bg-gradient-to-br from-sky-500 to-indigo-500'
          }`}>
            {isAdmin ? <HiShieldCheck size={16} /> : initial}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/50 hover:text-white transition-colors"
          onClick={() => setOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {open ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
        </button>
      </div>

      {/* Mobile dropdown — same role-specific links */}
      {open && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex flex-col gap-1 animate-slide-up">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkCls}
              onClick={() => setOpen(false)}
            >
              <span className="block px-2 py-2.5">{l.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
