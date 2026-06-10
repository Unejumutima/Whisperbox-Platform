import { NavLink } from 'react-router-dom'
import {
  HiHome, HiChatAlt2, HiPencilAlt, HiUser, HiShieldCheck,
} from 'react-icons/hi'
import clsx from 'clsx'

interface SidebarProps {
  anonymousName?: string
  email?: string
  isAdmin?: boolean
}

const navItems = [
  { label: 'Dashboard',      to: '/dashboard', Icon: HiHome      },
  { label: 'Feed',           to: '/feed',      Icon: HiChatAlt2  },
  { label: 'Create Whisper', to: '/create',    Icon: HiPencilAlt },
  { label: 'My Profile',     to: '/profile',   Icon: HiUser      },
]

/**
 * Desktop-only left sidebar (hidden on < lg).
 * Shows nav links and a user card at the bottom.
 * isAdmin prop reveals the Admin link.
 */
export default function Sidebar({ anonymousName, email, isAdmin = false }: SidebarProps) {
  const items = isAdmin ? [...navItems, { label: 'Admin', to: '/admin', Icon: HiShieldCheck }] : navItems

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
      {
        'bg-sky-500/10 text-sky-400 border border-sky-500/25':     isActive,
        'text-white/50 hover:bg-white/5 hover:text-white/90': !isActive,
      }
    )

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen shrink-0 bg-slate-950/60 backdrop-blur-sm border-r border-white/10">

      {/* Logo */}
      <div className="px-5 py-6">
        <span className="gradient-text font-bold text-lg tracking-tight select-none">✦ Whisperbox</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {items.map(({ label, to, Icon }) => (
          <NavLink key={to} to={to} className={linkCls}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      {(anonymousName || email) && (
        <div className="m-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {anonymousName?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="overflow-hidden min-w-0">
              {anonymousName && <p className="text-white text-sm font-medium truncate">{anonymousName}</p>}
              {email         && <p className="text-white/40 text-xs truncate">{email}</p>}
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
