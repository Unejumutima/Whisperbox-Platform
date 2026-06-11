import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiPencilAlt, HiChatAlt2 } from 'react-icons/hi'
import { useAuth }     from '../hooks/useAuth'
import { useWhispers } from '../hooks/useWhispers'
import WhisperCard     from '../components/ui/WhisperCard'
import SearchBar       from '../components/ui/SearchBar'
import Pagination      from '../components/ui/Pagination'
import EmptyState      from '../components/ui/EmptyState'
import LoadingSpinner  from '../components/ui/LoadingSpinner'

const PAGE_SIZE = 8

/**
 * MyWhispersPage — STUDENT only.
 *
 * Shows all whispers posted under the current user's anonymous name.
 * Filters the backend response by anonymousName client-side (simple approach).
 * Students cannot post as someone else so this is accurate.
 */
export default function MyWhispersPage() {
  const navigate     = useNavigate()
  const { user }     = useAuth()
  const [page, setPage]   = useState(0)
  const [query, setQuery] = useState('')

  // Fetch a large page so we can filter client-side by anonymous name
  const { whispers, pageInfo, loading, error } = useWhispers({
    page: 0,
    size: 100,
    sortBy: 'id',
    direction: 'desc',
  })

  // Filter to only this student's whispers (matched by anonymousName)
  const myWhispers = useMemo(() => {
    if (!user?.anonymousName) return []
    return whispers.filter(
      (w) => w.anonymousName === user.anonymousName
    )
  }, [whispers, user])

  // Then apply search query
  const filtered = useMemo(() => {
    if (!query.trim()) return myWhispers
    const q = query.toLowerCase()
    return myWhispers.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.content.toLowerCase().includes(q)
    )
  }, [myWhispers, query])

  // Paginate client-side
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages - 1)
  const visible    = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="page-container animate-fade-in space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">My Whispers</h1>
          <p className="text-white/40 text-sm mt-1">
            Posted as{' '}
            <span className="text-sky-400 font-medium">
              {user?.anonymousName ?? '…'}
            </span>
          </p>
        </div>
        <button
          className="btn-primary self-start sm:self-auto"
          onClick={() => navigate('/create')}
        >
          <HiPencilAlt size={16} /> New Whisper
        </button>
      </div>

      {/* Search */}
      <SearchBar
        value={query}
        onChange={(v) => { setQuery(v); setPage(0) }}
        placeholder="Search your whispers…"
      />

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner label="Loading your whispers…" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="glass border border-red-500/20 px-5 py-4 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && visible.length === 0 && (
        <EmptyState
          Icon={HiChatAlt2}
          title={query ? 'No whispers match your search' : "You haven't posted any whispers yet"}
          description={query ? 'Try a different search term.' : 'Click "New Whisper" to share something anonymously.'}
        />
      )}

      {/* Whisper cards */}
      {!loading && !error && visible.length > 0 && (
        <div className="flex flex-col gap-3">
          {visible.map((w) => <WhisperCard key={w.id} whisper={w} />)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (
        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
