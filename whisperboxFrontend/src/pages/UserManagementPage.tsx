import { useState, useEffect, useCallback } from 'react'
import {
  HiUserGroup, HiCheck, HiX, HiRefresh, HiExclamation, HiMail, HiUser,
} from 'react-icons/hi'
import toast          from 'react-hot-toast'
import Modal          from '../components/ui/Modal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState     from '../components/ui/EmptyState'
import { getPendingUsers, approveUser, rejectUser } from '../services/userService'
import type { PendingUser } from '../services/userService'
import { formatDate } from '../utils/formatDate'

/**
 * UserManagementPage — Admin only.
 * Fetches all users with approved = false and lets the admin approve or reject them.
 *
 * Approve → sets approved = true, user can now log in and use the platform.
 * Reject  → permanently deletes the user account.
 */
export default function UserManagementPage() {
  const [users,    setUsers]    = useState<PendingUser[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [working,  setWorking]  = useState<number | null>(null) // id being processed

  // ── Fetch pending users ───────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPendingUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pending users.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // ── Approve ───────────────────────────────────────────────────────────────
  const handleApprove = async (id: number) => {
    setWorking(id)
    try {
      await approveUser(id)
      toast.success('User approved. They can now access the platform.')
      // Remove from the list immediately — no need to refetch
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve user.')
    } finally {
      setWorking(null)
    }
  }

  // ── Reject (with confirmation) ────────────────────────────────────────────
  const handleReject = async () => {
    if (rejectId === null) return
    setWorking(rejectId)
    try {
      await rejectUser(rejectId)
      toast.success('User rejected and removed.')
      setUsers((prev) => prev.filter((u) => u.id !== rejectId))
      setRejectId(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject user.')
      setRejectId(null)
    } finally {
      setWorking(null)
    }
  }

  return (
    <div className="page-container animate-fade-in space-y-8">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/20 rounded-xl p-2.5">
            <HiUserGroup size={22} className="text-sky-400" />
          </div>
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="text-white/40 text-sm">
              {loading ? 'Loading…' : `${users.length} user${users.length !== 1 ? 's' : ''} waiting for approval`}
            </p>
          </div>
        </div>

        {/* Refresh button */}
        <button onClick={load} className="btn-ghost px-3 py-2 text-sm" title="Refresh">
          <HiRefresh size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ── How it works info banner ─────────────────────────────────── */}
      <div className="flex items-start gap-3 glass border border-sky-500/20 bg-sky-500/5 px-5 py-4 rounded-xl">
        <HiExclamation size={18} className="text-sky-400 shrink-0 mt-0.5" />
        <p className="text-sky-300/80 text-sm leading-relaxed">
          New users must be approved before they can access the platform. Approved users keep their
          anonymous name and can post whispers. Rejected users are permanently removed — they can
          re-register by logging in with Google again.
        </p>
      </div>

      {/* ── Loading ───────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner label="Loading pending users…" />
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────── */}
      {!loading && error && (
        <div className="glass border border-red-500/20 px-5 py-4 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── Empty ────────────────────────────────────────────────────── */}
      {!loading && !error && users.length === 0 && (
        <EmptyState
          Icon={HiUserGroup}
          title="No pending approvals"
          description="All registered users have been reviewed."
        />
      )}

      {/* ── User cards ───────────────────────────────────────────────── */}
      {!loading && !error && users.length > 0 && (
        <div className="flex flex-col gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="glass p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-sky-500/20 transition-all duration-200"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-base font-bold shrink-0 select-none">
                {(user.anonymousName ?? user.email).charAt(0).toUpperCase()}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-white font-semibold text-sm">
                  {user.anonymousName ?? 'Unnamed'}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1.5 text-white/40 text-xs">
                    <HiMail size={12} /> {user.email}
                  </span>
                  {user.fullName && (
                    <span className="flex items-center gap-1.5 text-white/40 text-xs">
                      <HiUser size={12} /> {user.fullName}
                    </span>
                  )}
                  <span className="text-white/25 text-xs">
                    Registered {formatDate(user.registeredAt)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  disabled={working === user.id}
                  onClick={() => handleApprove(user.id)}
                  className="btn-success px-4 py-2 text-sm font-semibold"
                >
                  {working === user.id
                    ? <span className="w-4 h-4 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
                    : <><HiCheck size={15} /> Approve</>
                  }
                </button>
                <button
                  disabled={working === user.id}
                  onClick={() => setRejectId(user.id)}
                  className="btn-danger px-4 py-2 text-sm font-semibold"
                >
                  <HiX size={15} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Reject confirmation modal ────────────────────────────────── */}
      <Modal isOpen={rejectId !== null} onClose={() => setRejectId(null)} title="Reject User">
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="bg-red-500/10 rounded-xl p-2.5 shrink-0 mt-0.5">
              <HiExclamation size={20} className="text-red-400" />
            </div>
            <div className="space-y-1">
              <p className="text-white font-medium text-sm">
                {users.find((u) => u.id === rejectId)?.email}
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                This user will be permanently removed. They can re-register by logging in with
                Google again and will require approval once more.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setRejectId(null)}>
              Cancel
            </button>
            <button
              className="flex-1 btn-danger py-2.5 rounded-xl font-semibold"
              onClick={handleReject}
              disabled={working !== null}
            >
              <HiX size={15} /> Reject permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
