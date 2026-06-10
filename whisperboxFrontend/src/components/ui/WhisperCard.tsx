import { HiClock, HiEye, HiTrash } from 'react-icons/hi'
import clsx from 'clsx'
import type { Whisper } from '../../services/whisperService'
import { formatDate } from '../../utils/formatDate'

interface WhisperCardProps {
  whisper: Whisper
  /** Show admin action buttons (Mark Seen, Delete) */
  isAdmin?: boolean
  onMarkSeen?: (id: number) => void
  onDelete?: (id: number) => void
}

/**
 * Reusable whisper card.
 * Accepts the backend Whisper type directly — no adapter needed.
 * Uses formatDate() to handle Spring's LocalDateTime array format.
 * anonymousName falls back to "Anonymous" when null.
 */
export default function WhisperCard({ whisper, isAdmin, onMarkSeen, onDelete }: WhisperCardProps) {
  const isSeen       = whisper.status === 'SEEN'
  const displayName  = whisper.anonymousName ?? 'Anonymous'
  const displayDate  = formatDate(whisper.createdAt)

  return (
    <article className={clsx(
      'glass p-5 flex flex-col gap-3 transition-all duration-200',
      'hover:border-sky-500/25 hover:bg-white/5 group'
    )}>
      {/* Top row — author + status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sky-400 text-sm font-medium">{displayName}</span>
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
      <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
        {whisper.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5 text-white/30 text-xs">
          <HiClock size={12} /> {displayDate}
        </span>

        {isAdmin && (
          <div className="flex items-center gap-2">
            {!isSeen && (
              <button onClick={() => onMarkSeen?.(whisper.id)} className="btn-success py-1 px-3 text-xs">
                <HiEye size={13} /> Mark Seen
              </button>
            )}
            <button onClick={() => onDelete?.(whisper.id)} className="btn-danger py-1 px-3 text-xs">
              <HiTrash size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
