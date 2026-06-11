import { NavLink } from 'react-router-dom'
import {
  HiHome, HiChatAlt2, HiPencilAlt, HiUser,
  HiShieldCheck, HiUserGroup, HiCollection, HiClipboardList,
} from 'react-icons/hi'
import clsx from 'clsx'

interface SidebarProps {
  anonymousName?: string | null
  email?: string | null
  isAdmin?: boolean
}

// ── Student navigation ────────────────────────────────────────────────────
const studentItems = [
  { label: 'Dashboard',      to: '/dashboard',  Icon: HiHome         },
  { label: 'Feed',           to: '/feed',       Icon: HiChatAlt2     },
  { label: 'Create Whisper', to: '/create',     Icon: HiPencilAlt    },
  { label: 'My Whispers',    to: '/my-whispers', Icon: HiClipboardList },
  { label: 'My Profile',     to: '/profile',    Icon: HiUser         },
]

// ── Admin navigation ──────────────────────────────────────────────────────
const adminItems = [
  { label: 'Dashboard',         to: '/dashboard',   Icon: HiHome        },
  { label: 'All Whispers',      to: '/admin',       Icon: HiCollection  },
  { label: 'User Management',   to: '/admin/users', Icon: HiUserGroup   },
  { label: 'Pending Approvals', to: '/admin/users', Icon: HiShieldCheck },
  { label: 'My Profile',        to: '/profile',     Icon: HiUser        },
]

/**
 * Sidebar — desktop only (hidden on < lg).
 *
 * Renders a completely different nav list depending on role.
 * Students see participation pages. Admins see management pages.
 * They do not share nav items (except Dashboard and Profile).
 */
export default function Sidebar({ anonymousName, email, isAdmin = false }: SidebarProps) {
  const items = isAdmin ? adminItems : studentItems

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
      {
        'bg-sky-500/10 text-sky-400 border border-sky-500/25':  isActive,
        'text-white/50 hover:bg-white/5 hover:text-white/90': !isActive,
      }
    )

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen shrink-0 bg-slate-950/60 backdrop-blur-sm border-r border-white/10">

      {/* Logo */}
      <div className="px-5 py-6">
        <span className="gradient-text font-bold text-lg tracking-tight select-none">
          ✦ Whisperbox
        </span>
        {/* Show ADMIN badge under logo for admin */}
        {isAdmin && (
          <span className="mt-1 flex items-center gap-1 text-violet-400 text-xs font-medium">
            <HiShieldCheck size={12} /> Administrator
          </span>
        )}
      </div>

      {/* Role-specific nav items */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {items.map(({ label, to, Icon }) => (
          <NavLink key={`${label}-${to}`} to={to} className={linkCls}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User card at bottom */}
      {email && (
        <div className="m-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
              isAdmin
                ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                : 'bg-gradient-to-br from-sky-500 to-indigo-500'
            }`}>
              {isAdmin
                ? <HiShieldCheck size={14} />
                : anonymousName?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {anonymousName ?? (isAdmin ? 'Admin' : 'User')}
              </p>
              <p className="text-white/40 text-xs truncate">{email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
