import { HiClock, HiEye, HiTrash } from 'react-icons/hi'
import clsx from 'clsx'

export interface WhisperCardData {
  id: number
  anonymousName: string
  title: string
  content: string
  date: string
  status: 'SEEN' | 'NOT_SEEN'
}

interface WhisperCardProps {
  whisper: WhisperCardData
  /** Show admin action buttons (Mark Seen, Delete) */
  isAdmin?: boolean
  onMarkSeen?: (id: number) => void
  onDelete?: (id: number) => void
}

/**
 * Reusable whisper card component.
 * Used on the Feed page and Admin page.
 *
 * Usage:
 *   <WhisperCard whisper={w} />
 *   <WhisperCard whisper={w} isAdmin onMarkSeen={handleSeen} onDelete={handleDelete} />
 */
export default function WhisperCard({ whisper, isAdmin, onMarkSeen, onDelete }: WhisperCardProps) {
  const isSeen = whisper.status === 'SEEN'

  return (
    <article className={clsx(
      'glass p-5 flex flex-col gap-3 transition-all duration-200',
      'hover:border-sky-500/25 hover:bg-white/8 group'
    )}>
      {/* Top row — author + status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Anonymous avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {whisper.anonymousName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sky-400 text-sm font-medium">{whisper.anonymousName}</span>
        </div>

        {isSeen
          ? <span className="badge-seen"><HiEye size={11} /> Seen</span>
          : <span className="badge-unseen">New</span>
        }
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-base leading-snug group-hover:text-sky-100 transition-colors">
        {whisper.title}
      </h3>

      {/* Content preview */}
      <p className="text-white/55 text-sm leading-relaxed line-clamp-3">
        {whisper.content}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5 text-white/30 text-xs">
          <HiClock size={12} />
          {whisper.date}
        </span>

        {/* Admin actions */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            {!isSeen && (
              <button
                onClick={() => onMarkSeen?.(whisper.id)}
                className="btn-success py-1 px-3 text-xs"
              >
                <HiEye size={13} /> Mark Seen
              </button>
            )}
            <button
              onClick={() => onDelete?.(whisper.id)}
              className="btn-danger py-1 px-3 text-xs"
            >
              <HiTrash size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
