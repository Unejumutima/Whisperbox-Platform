import { useState, useMemo } from 'react'
import { HiChatAlt2, HiEye, HiShieldCheck, HiTrash, HiExclamation, HiRefresh } from 'react-icons/hi'
import toast          from 'react-hot-toast'
import Pagination     from '../components/ui/Pagination'
import SearchBar      from '../components/ui/SearchBar'
import Modal          from '../components/ui/Modal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState     from '../components/ui/EmptyState'
import { useWhispers } from '../hooks/useWhispers'
import { markAsSeen, deleteWhisper } from '../services/whisperService'
import type { Whisper } from '../services/whisperService'
import { formatDate } from '../utils/formatDate'

const PAGE_SIZE = 8

/**
 * Admin page — visible only to ADMIN users (enforced by ProtectedRoute).
 * Fetches real whispers, supports Mark Seen and Delete with confirmation modal.
 */
export default function AdminPage() {
  const [page,     setPage]     = useState(0)
  const [query,    setQuery]    = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { whispers, pageInfo, loading, error, refetch } = useWhispers({
    page,
    size:      PAGE_SIZE,
    sortBy:    'id',
    direction: 'desc',
  })

  // Client-side search on current page
  const filtered = useMemo(() => {
    if (!query.trim()) return whispers
    const q = query.toLowerCase()
    return whispers.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        (w.anonymousName ?? '').toLowerCase().includes(q)
    )
  }, [whispers, query])

  const totalPages = pageInfo?.totalPages ?? 1
  const total      = pageInfo?.totalElements ?? 0
  const unseen     = whispers.filter((w) => w.status === 'NOT_SEEN').length

  const handleSearch = (v: string) => { setQuery(v); setPage(0) }

  // ── Mark as seen ─────────────────────────────────────────────────────────
  const handleMarkSeen = async (id: number) => {
    try {
      await markAsSeen(id)
      toast.success('Marked as seen.')
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update.')
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (deleteId === null) return
    try {
      await deleteWhisper(deleteId)
      toast.success('Whisper deleted.')
      setDeleteId(null)
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete.')
      setDeleteId(null)
    }
  }

  const stats = [
    { label: 'Total Whispers', value: total,  Icon: HiChatAlt2, color: 'text-sky-400',    bg: 'bg-sky-500/10'    },
    { label: 'Unseen',         value: unseen, Icon: HiEye,      color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ]

  return (
    <div className="page-container animate-fade-in space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-violet-500/20 rounded-xl p-2.5">
            <HiShieldCheck size={22} className="text-violet-400" />
          </div>
          <div>
            <h1 className="page-title">Admin Panel</h1>
            <p className="text-white/40 text-sm">Manage all whispers on the platform.</p>
          </div>
        </div>
        {/* Manual refresh */}
        <button onClick={refetch} className="btn-ghost px-3 py-2 text-sm" title="Refresh">
          <HiRefresh size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="glass p-6 flex items-center gap-4">
            <div className={`${bg} rounded-xl p-3 shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              {loading
                ? <div className="w-10 h-8 bg-white/10 rounded-lg animate-pulse" />
                : <p className="text-3xl font-bold text-white">{value}</p>
              }
              <p className="text-white/40 text-sm mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <SearchBar value={query} onChange={handleSearch} placeholder="Search whispers…" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner label="Loading whispers…" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="glass border border-red-500/20 px-5 py-4 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState title="No whispers found" description={query ? 'Try a different search.' : 'No whispers have been posted yet.'} />
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="table-header-cell">ID</th>
                  <th className="table-header-cell">Alias</th>
                  <th className="table-header-cell">Title</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w: Whisper) => (
                  <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="table-body-cell text-white/30">#{w.id}</td>

                    <td className="table-body-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(w.anonymousName ?? 'A').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sky-400 text-sm">{w.anonymousName ?? 'Anonymous'}</span>
                      </div>
                    </td>

                    <td className="table-body-cell max-w-[200px]">
                      <span className="line-clamp-1 text-white">{w.title}</span>
                    </td>

                    <td className="table-body-cell">
                      {w.status === 'SEEN'
                        ? <span className="badge-seen"><HiEye size={10} /> Seen</span>
                        : <span className="badge-unseen">New</span>
                      }
                    </td>

                    <td className="table-body-cell text-white/40">
                      {formatDate(w.createdAt)}
                    </td>

                    <td className="table-body-cell">
                      <div className="flex items-center gap-2">
                        {w.status === 'NOT_SEEN' && (
                          <button
                            onClick={() => handleMarkSeen(w.id)}
                            className="btn-success py-1 px-3 text-xs"
                          >
                            <HiEye size={12} /> Seen
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(w.id)}
                          className="btn-danger py-1 px-3 text-xs"
                        >
                          <HiTrash size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Delete confirmation modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Whisper">
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="bg-red-500/10 rounded-xl p-2.5 shrink-0 mt-0.5">
              <HiExclamation size={20} className="text-red-400" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              This will permanently delete the whisper. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setDeleteId(null)}>
              Cancel
            </button>
            <button className="flex-1 btn-danger py-2.5 rounded-xl font-semibold" onClick={handleDelete}>
              <HiTrash size={15} /> Delete permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
