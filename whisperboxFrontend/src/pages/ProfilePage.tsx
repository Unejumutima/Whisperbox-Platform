import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiLogout, HiUser, HiMail, HiBadgeCheck, HiCalendar, HiShieldCheck } from 'react-icons/hi'
import { useAuth } from '../hooks/useAuth'
import Modal from '../components/ui/Modal'
import LoadingSpinner from '../components/ui/LoadingSpinner'

/**
 * ProfilePage
 * Works for both STUDENT and ADMIN.
 * STUDENT → shows anonymous alias + student badge
 * ADMIN   → shows "Admin" label + admin badge, no anonymous name
 */
export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  if (!user) {
    return (
      <div className="page-container flex items-center justify-center py-24">
        <LoadingSpinner label="Loading profile…" />
      </div>
    )
  }

  const isAdmin = user.role === 'ADMIN'

  // Safe display values — never crash on null
  const displayName = user.anonymousName ?? (isAdmin ? 'Admin' : 'Anonymous')
  const initial     = displayName.charAt(0).toUpperCase()

  const infoRows = [
    { Icon: HiMail,       label: 'Email',   value: user.email    },
    { Icon: HiBadgeCheck, label: 'Role',    value: user.role     },
    { Icon: HiCalendar,   label: 'User ID', value: `#${user.id}` },
  ]

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="text-white/40 text-sm mt-1">
            {isAdmin
              ? 'You are logged in as the platform administrator.'
              : 'Your public identity is always anonymous.'}
          </p>
        </div>

        {/* Profile card */}
        <div className="glass p-8 flex flex-col items-center gap-6">

          {/* Avatar */}
          <div className="relative">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold select-none shadow-lg ${
              isAdmin
                ? 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-violet-500/25'
                : 'bg-gradient-to-br from-sky-500 to-indigo-500 shadow-sky-500/25'
            }`}>
              {isAdmin ? <HiShieldCheck size={36} /> : initial}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>

          {/* Display name + role badge */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-white text-2xl font-bold">{displayName}</h2>

            {isAdmin ? (
              <span className="badge-admin">
                <HiShieldCheck size={11} /> ADMIN
              </span>
            ) : (
              <span className="badge-unseen">
                <HiUser size={11} /> STUDENT
              </span>
            )}

            <p className="text-white/30 text-xs mt-0.5">
              {isAdmin
                ? 'Administrator account — full platform access.'
                : 'This is your anonymous alias — it is the only name others see.'}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10" />

          {/* Info rows */}
          <div className="w-full flex flex-col divide-y divide-white/10">
            {infoRows.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-2.5 text-white/40">
                  <Icon size={15} />
                  <span className="text-sm">{label}</span>
                </div>
                <span className="text-white text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Sign out */}
          <button
            className="w-full btn-ghost text-red-400/80 border-red-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40"
            onClick={() => setShowLogout(true)}
          >
            <HiLogout size={16} /> Sign out
          </button>
        </div>
      </div>

      {/* Logout confirmation modal */}
      <Modal isOpen={showLogout} onClose={() => setShowLogout(false)} title="Sign out">
        <div className="flex flex-col gap-5">
          <p className="text-white/60 text-sm leading-relaxed">
            Are you sure you want to sign out?
          </p>
          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setShowLogout(false)}>
              Cancel
            </button>
            <button
              className="flex-1 btn-danger py-2.5 rounded-xl font-semibold"
              onClick={handleLogout}
            >
              <HiLogout size={15} /> Sign out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
