import { useState, useMemo } from 'react'
import { HiChatAlt2 } from 'react-icons/hi'
import WhisperCard    from '../components/ui/WhisperCard'
import SearchBar      from '../components/ui/SearchBar'
import SortDropdown   from '../components/ui/SortDropdown'
import Pagination     from '../components/ui/Pagination'
import EmptyState     from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useWhispers } from '../hooks/useWhispers'

const PAGE_SIZE = 10

const sortOptions = [
  { label: 'Newest first', value: 'desc' },
  { label: 'Oldest first', value: 'asc'  },
]

/**
 * Feed page — fetches real whispers from the backend.
 *
 * Pagination is server-side (page/size params sent to backend).
 * Search is client-side against the current page — lightweight for academics.
 */
export default function FeedPage() {
  const [page,      setPage]      = useState(0)
  const [direction, setDirection] = useState('desc')
  const [query,     setQuery]     = useState('')

  const { whispers, pageInfo, loading, error } = useWhispers({
    page,
    size:      PAGE_SIZE,
    sortBy:    'id',
    direction,
  })

  // Client-side search filter on the current page
  const visible = useMemo(() => {
    if (!query.trim()) return whispers
    const q = query.toLowerCase()
    return whispers.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.content.toLowerCase().includes(q) ||
        (w.anonymousName ?? '').toLowerCase().includes(q)
    )
  }, [whispers, query])

  const totalPages = pageInfo?.totalPages ?? 1

  // Reset to page 0 when sort changes
  const handleSort = (v: string) => { setDirection(v); setPage(0) }

  return (
    <div className="page-container animate-fade-in space-y-7">

      {/* Header */}
      <div>
        <h1 className="page-title">Whisper Feed</h1>
        <p className="text-white/40 text-sm mt-1">
          {loading
            ? 'Loading…'
            : `${pageInfo?.totalElements ?? 0} whisper${pageInfo?.totalElements !== 1 ? 's' : ''} on the platform`
          }
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by title, content, or name…"
        />
        <SortDropdown value={direction} onChange={handleSort} options={sortOptions} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="md" label="Loading whispers…" />
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
          title={query ? 'No whispers match your search' : 'No whispers yet'}
          description={query ? 'Try a different search term.' : 'Be the first to post!'}
        />
      )}

      {/* Whisper cards */}
      {!loading && !error && visible.length > 0 && (
        <div className="flex flex-col gap-3">
          {visible.map((w) => <WhisperCard key={w.id} whisper={w} />)}
        </div>
      )}

      {/* Server-side pagination */}
      {!loading && !error && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
