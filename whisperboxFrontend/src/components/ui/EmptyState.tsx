import type { IconType } from 'react-icons'
import { HiInbox } from 'react-icons/hi'

interface EmptyStateProps {
  Icon?: IconType
  title?: string
  description?: string
}

/**
 * Empty state placeholder shown when a list has no items.
 * Usage: <EmptyState title="No whispers yet" description="Be the first to post." />
 */
export default function EmptyState({
  Icon = HiInbox,
  title = 'Nothing here yet',
  description = 'Check back later.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="bg-white/5 rounded-2xl p-5">
        <Icon size={36} className="text-white/20" />
      </div>
      <p className="text-white/50 font-medium">{title}</p>
      <p className="text-white/25 text-sm">{description}</p>
    </div>
  )
}
