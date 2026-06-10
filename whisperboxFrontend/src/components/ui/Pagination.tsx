import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import clsx from 'clsx'

interface PaginationProps {
  currentPage: number       // 0-indexed to match Spring Boot
  totalPages: number
  onPageChange: (page: number) => void
}

/**
 * Pagination controls.
 * currentPage is 0-indexed (Spring Boot convention).
 * Displays 1-indexed labels to users.
 *
 * Usage: <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
 */
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const isFirst = currentPage === 0
  const isLast  = currentPage === totalPages - 1

  // Build page number buttons — show up to 5 centered around current page
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5))
  const end   = Math.min(totalPages - 1, start + 4)
  const pages = range(start, end)

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {/* Previous */}
      <button
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        className={clsx(
          'flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
          isFirst
            ? 'text-white/20 cursor-not-allowed'
            : 'text-white/60 hover:bg-white/8 hover:text-white'
        )}
      >
        <HiChevronLeft size={16} /> Prev
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={clsx(
            'w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200',
            p === currentPage
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'text-white/50 hover:bg-white/8 hover:text-white'
          )}
        >
          {p + 1}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        className={clsx(
          'flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
          isLast
            ? 'text-white/20 cursor-not-allowed'
            : 'text-white/60 hover:bg-white/8 hover:text-white'
        )}
      >
        Next <HiChevronRight size={16} />
      </button>
    </div>
  )
}
