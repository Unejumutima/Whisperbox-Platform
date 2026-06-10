import { useState, useMemo } from 'react'
import { HiChatAlt2, HiEye, HiShieldCheck, HiTrash, HiExclamation } from 'react-icons/hi'
import Pagination   from '../components/ui/Pagination'
import SearchBar    from '../components/ui/SearchBar'
import Modal        from '../components/ui/Modal'
import { MOCK_WHISPERS } from '../utils/mockData'
import type { WhisperCardData } from '../components/ui/WhisperCard'

const PAGE_SIZE = 5

/**
 * Admin page — only shown to users with role ADMIN.
 * Displays stats, searchable/paginated whisper table with Mark Seen and Delete actions.
 * Currently uses mock data; actions update local state only.
 */
export default function AdminPage() {
  const [whispers, setWhispers] = useState<WhisperCardData[]>(MOCK_WHISPERS)
  const [query,    setQuery]    = useState('')
  const [page,     setPage]     = useState(0)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  /* Stats */
  const total  = whispers.length
  const unseen = whispers.filter((w) => w.status === 'NOT_SEEN').length

  /* Filter */
  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return whispers.filter(
      (w) => w.title.toLowerCase().includes(q) || w.anonymousName.toLowerCase().includes(q)
    )
  }, [whispers, query])

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages - 1)
  const visible    = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const handleSearch  = (v: string) => { setQuery(v); setPage(0) }
  const handleSeen    = (id: number) =>
    setWhispers((prev) => prev.map((w) => w.id === id ? { ...w, status: 'SEEN' } : w))
  const handleDelete  = (id: number) => {
    setWhispers((prev) => prev.filter((w) => w.id !== id))
    setDeleteId(null)
  }

  const stats = [
    { label: 'Total Whispers', value: total,  Icon: HiChatAlt2,   color: 'text-sky-400',    bg: 'bg-sky-500/10'    },
    { label: 'Unseen',         value: unseen, Icon: HiEye,        color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ]

  return (
    <div className="page-container animate-fade-in space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-violet-500/20 rounded-xl p-2.5">
          <HiShieldCheck size={22} className="text-violet-400" />
        </div>
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="text-white/40 text-sm">Manage all whispers on the platform.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="glass p-6 flex items-center gap-4">
            <div className={`${bg} rounded-xl p-3 shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-white/40 text-sm mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <SearchBar value={query} onChange={handleSearch} placeholder="Search whispers…" />
      </div>

      {/* Table */}
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
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-white/30 py-12 text-sm">
                    No whispers match your search.
                  </td>
                </tr>
              ) : (
                visible.map((w) => (
                  <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="table-body-cell text-white/30">#{w.id}</td>
                    <td className="table-body-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {w.anonymousName.charAt(0)}
                        </div>
                        <span className="text-sky-400 text-sm">{w.anonymousName}</span>
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
                    <td className="table-body-cell text-white/40">{w.date}</td>
                    <td className="table-body-cell">
                      <div className="flex items-center gap-2">
                        {w.status === 'NOT_SEEN' && (
                          <button onClick={() => handleSeen(w.id)} className="btn-success py-1 px-3 text-xs">
                            <HiEye size={12} /> Seen
                          </button>
                        )}
                        <button onClick={() => setDeleteId(w.id)} className="btn-danger py-1 px-3 text-xs">
                          <HiTrash size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Whisper"
      >
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
            <button className="btn-ghost flex-1" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="flex-1 btn-danger py-2.5 rounded-xl font-semibold" onClick={() => deleteId && handleDelete(deleteId)}>
              <HiTrash size={15} /> Delete permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
