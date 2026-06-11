import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiPencilAlt, HiChatAlt2, HiTrash, HiPencil,
  HiExclamation, HiRefresh, HiEye, HiClock,
} from 'react-icons/hi'
import toast          from 'react-hot-toast'
import clsx           from 'clsx'
import { useAuth }    from '../hooks/useAuth'
import SearchBar      from '../components/ui/SearchBar'
import SortDropdown   from '../components/ui/SortDropdown'
import Pagination     from '../components/ui/Pagination'
import EmptyState     from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Modal          from '../components/ui/Modal'
import {
  getMyWhispers, updateWhisper, deleteWhisper,
} from '../services/whisperService'
import type { Whisper, WhisperPage } from '../services/whisperService'
import { formatDate } from '../utils/formatDate'

const PAGE_SIZE = 8

const sortOptions = [
  { label: 'Newest first', value: 'desc' },
  { label: 'Oldest first', value: 'asc'  },
]

/**
 * MyWhispersPage — STUDENT only.
 *
 * Fetches only the logged-in student's whispers from GET /api/whispers/mine.
 * Supports server-side pagination and sorting.
 * Each whisper card shows:
 *   - Edit button (open inline edit modal)
 *   - Delete button — disabled with tooltip if status is SEEN
 */
export default function MyWhispersPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // ── Fetch state ──────────────────────────────────────────────────────────
  const [whispers,  setWhispers]  = useState<Whisper[]>([])
  const [pageInfo,  setPageInfo]  = useState<Omit<WhisperPage, 'content'> | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  // ── Controls ─────────────────────────────────────────────────────────────
  const [page,      setPage]      = useState(0)
  const [direction, setDirection] = useState('desc')
  const [query,     setQuery]     = useState('')

  // ── Edit modal state ─────────────────────────────────────────────────────
  const [editWhisper,  setEditWhisper]  = useState<Whisper | null>(null)
  const [editTitle,    setEditTitle]    = useState('')
  const [editContent,  setEditContent]  = useState('')
  const [editLoading,  setEditLoading]  = useState(false)

  // ── Delete confirm modal state ───────────────────────────────────────────
  const [deleteId,     setDeleteId]     = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyWhispers(page, PAGE_SIZE, 'createdAt', direction)
      setWhispers(data.content)
      const { content: _, ...rest } = data
      setPageInfo(rest)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load whispers.')
    } finally {
      setLoading(false)
    }
  }, [page, direction])

  useEffect(() => { load() }, [load])

  const handleSortChange = (v: string) => { setDirection(v); setPage(0) }

  // ── Client-side search on current page ────────────────────────────────────
  const visible = query.trim()
    ? whispers.filter(
        (w) =>
          w.title.toLowerCase().includes(query.toLowerCase()) ||
          w.content.toLowerCase().includes(query.toLowerCase())
      )
    : whispers

  // ── Open edit modal ───────────────────────────────────────────────────────
  const openEdit = (w: Whisper) => {
    setEditWhisper(w)
    setEditTitle(w.title)
    setEditContent(w.content)
  }

  // ── Save edit ─────────────────────────────────────────────────────────────
  const handleEditSave = async () => {
    if (!editWhisper) return
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('Title and content cannot be empty.')
      return
    }
    setEditLoading(true)
    try {
      await updateWhisper(editWhisper.id, {
        title:   editTitle.trim(),
        content: editContent.trim(),
      })
      toast.success('Whisper updated.')
      setEditWhisper(null)
      load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update.')
    } finally {
      setEditLoading(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (deleteId === null) return
    setDeleteLoading(true)
    try {
      await deleteWhisper(deleteId)
      toast.success('Whisper deleted.')
      setDeleteId(null)
      load()
    } catch (err) {
      // Backend sends: "This whisper has already been seen by an admin and cannot be deleted."
      toast.error(err instanceof Error ? err.message : 'Failed to delete.')
      setDeleteId(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const totalPages = pageInfo?.totalPages ?? 1

  return (
    <div className="page-container animate-fade-in space-y-7">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">My Whispers</h1>
          <p className="text-white/40 text-sm mt-1">
            Posted as{' '}
            <span className="text-sky-400 font-medium">
              {user?.anonymousName ?? '…'}
            </span>
            {pageInfo && (
              <span className="ml-2 text-white/25">
                · {pageInfo.totalElements} total
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button onClick={load} className="btn-ghost px-3 py-2" title="Refresh">
            <HiRefresh size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="btn-primary" onClick={() => navigate('/create')}>
            <HiPencilAlt size={16} /> New Whisper
          </button>
        </div>
      </div>

      {/* ── Controls: search + sort ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search your whispers…"
        />
        <SortDropdown
          value={direction}
          onChange={handleSortChange}
          options={sortOptions}
        />
      </div>

      {/* ── Loading ────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner label="Loading your whispers…" />
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────── */}
      {!loading && error && (
        <div className="glass border border-red-500/20 px-5 py-4 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── Empty ──────────────────────────────────────────────────── */}
      {!loading && !error && visible.length === 0 && (
        <EmptyState
          Icon={HiChatAlt2}
          title={query ? 'No whispers match your search' : "You haven't posted any whispers yet"}
          description={
            query
              ? 'Try a different search term.'
              : 'Click "New Whisper" to share something anonymously.'
          }
        />
      )}

      {/* ── Whisper cards ──────────────────────────────────────────── */}
      {!loading && !error && visible.length > 0 && (
        <div className="flex flex-col gap-4">
          {visible.map((w) => {
            const isSeen    = w.status === 'SEEN'
            const canDelete = !isSeen  // cannot delete once admin has seen it

            return (
              <div
                key={w.id}
                className="glass p-5 flex flex-col gap-3 hover:border-sky-500/25 transition-all duration-200"
              >
                {/* Top row: status + actions */}
                <div className="flex items-center justify-between">
                  {isSeen
                    ? <span className="badge-seen"><HiEye size={11} /> Seen by admin</span>
                    : <span className="badge-unseen">Not yet seen</span>
                  }

                  <div className="flex items-center gap-2">
                    {/* Edit — always available */}
                    <button
                      onClick={() => openEdit(w)}
                      className="btn-ghost py-1 px-3 text-xs"
                      title="Edit whisper"
                    >
                      <HiPencil size={13} /> Edit
                    </button>

                    {/* Delete — disabled if SEEN */}
                    <button
                      onClick={() => canDelete && setDeleteId(w.id)}
                      disabled={!canDelete}
                      title={
                        canDelete
                          ? 'Delete whisper'
                          : 'Cannot delete — admin has already seen this'
                      }
                      className={clsx(
                        'btn-danger py-1 px-3 text-xs',
                        !canDelete && 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      <HiTrash size={13} /> Delete
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-base leading-snug">
                  {w.title}
                </h3>

                {/* Content */}
                <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                  {w.content}
                </p>

                {/* Date */}
                <span className="flex items-center gap-1.5 text-white/25 text-xs">
                  <HiClock size={12} /> {formatDate(w.createdAt)}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Server-side pagination ─────────────────────────────────── */}
      {!loading && !error && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* ── Edit modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={editWhisper !== null}
        onClose={() => setEditWhisper(null)}
        title="Edit Whisper"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/70 text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              className="input-field"
              maxLength={100}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={editLoading}
            />
            <p className="text-white/25 text-xs text-right">
              {editTitle.length} / 100
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/70 text-sm font-medium">
              Content
            </label>
            <textarea
              className="input-field resize-none"
              rows={5}
              maxLength={2000}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={editLoading}
            />
            <p className="text-white/25 text-xs text-right">
              {editContent.length} / 2000
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="btn-ghost flex-1"
              onClick={() => setEditWhisper(null)}
              disabled={editLoading}
            >
              Cancel
            </button>
            <button
              className="btn-primary flex-1"
              onClick={handleEditSave}
              disabled={editLoading}
            >
              {editLoading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving…</>
                : 'Save Changes'
              }
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete confirmation modal ──────────────────────────────── */}
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
              This will permanently delete your whisper. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="btn-ghost flex-1"
              onClick={() => setDeleteId(null)}
              disabled={deleteLoading}
            >
              Cancel
            </button>
            <button
              className="flex-1 btn-danger py-2.5 rounded-xl font-semibold"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading
                ? <span className="w-4 h-4 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
                : <><HiTrash size={15} /> Delete permanently</>
              }
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
