import { useState, useMemo } from 'react'
import { HiChatAlt2 } from 'react-icons/hi'
import WhisperCard     from '../components/ui/WhisperCard'
import SearchBar       from '../components/ui/SearchBar'
import SortDropdown    from '../components/ui/SortDropdown'
import Pagination      from '../components/ui/Pagination'
import EmptyState      from '../components/ui/EmptyState'
import { MOCK_WHISPERS } from '../utils/mockData'

const PAGE_SIZE = 4

const sortOptions = [
  { label: 'Newest first', value: 'desc' },
  { label: 'Oldest first', value: 'asc'  },
]

/**
 * Feed page — displays all whispers with search, sort, and pagination.
 * Uses mock data; backend integration will replace this later.
 */
export default function FeedPage() {
  const [query, setQuery]   = useState('')
  const [sort, setSort]     = useState('desc')
  const [page, setPage]     = useState(0)

  /* Filter by search query */
  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return MOCK_WHISPERS.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.content.toLowerCase().includes(q) ||
        w.anonymousName.toLowerCase().includes(q)
    )
  }, [query])

  /* Sort */
  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        sort === 'desc'
          ? b.id - a.id
          : a.id - b.id
      ),
    [filtered, sort]
  )

  /* Paginate */
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages - 1)
  const visible    = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  /* Reset to page 0 when query or sort changes */
  const handleQuery = (v: string) => { setQuery(v); setPage(0) }
  const handleSort  = (v: string) => { setSort(v);  setPage(0) }

  return (
    <div className="page-container animate-fade-in space-y-7">

      {/* Header */}
      <div>
        <h1 className="page-title">Whisper Feed</h1>
        <p className="text-white/40 text-sm mt-1">
          {sorted.length} whisper{sorted.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={query}
          onChange={handleQuery}
          placeholder="Search by title, content, or name…"
        />
        <SortDropdown value={sort} onChange={handleSort} options={sortOptions} />
      </div>

      {/* Whisper cards */}
      {visible.length === 0 ? (
        <EmptyState
          Icon={HiChatAlt2}
          title="No whispers found"
          description="Try a different search term."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((w) => <WhisperCard key={w.id} whisper={w} />)}
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
