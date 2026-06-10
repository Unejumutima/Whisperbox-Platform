interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

// Sizes in Tailwind classes
const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-9 h-9 border-[3px]',
  lg: 'w-14 h-14 border-4',
}

/**
 * Reusable spinner shown during loading states.
 * Usage: <LoadingSpinner /> or <LoadingSpinner size="lg" label="Loading whispers..." />
 */
export default function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-white/10 border-t-sky-400 animate-spin`}
      />
      {label && <p className="text-white/40 text-sm">{label}</p>}
    </div>
  )
}
