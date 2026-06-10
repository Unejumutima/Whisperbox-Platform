import { HiSearch, HiX } from 'react-icons/hi'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * Reusable search bar with a clear button.
 * Usage: <SearchBar value={q} onChange={setQ} placeholder="Search whispers..." />
 */
export default function SearchBar({ value, onChange, placeholder = 'Search…' }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      {/* Search icon */}
      <HiSearch
        size={17}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
      />

      <input
        type="text"
        className="input-field pl-10 pr-10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Clear button — only visible when input has content */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
          aria-label="Clear search"
        >
          <HiX size={16} />
        </button>
      )}
    </div>
  )
}
