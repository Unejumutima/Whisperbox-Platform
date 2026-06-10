import { HiSortAscending } from 'react-icons/hi'

interface SortOption {
  label: string
  value: string
}

interface SortDropdownProps {
  value: string
  onChange: (value: string) => void
  options: SortOption[]
}

/**
 * Reusable sort/filter dropdown.
 * Usage:
 *   const opts = [{ label: 'Newest', value: 'desc' }, { label: 'Oldest', value: 'asc' }]
 *   <SortDropdown value={sort} onChange={setSort} options={opts} />
 */
export default function SortDropdown({ value, onChange, options }: SortDropdownProps) {
  return (
    <div className="relative shrink-0">
      {/* Icon overlay */}
      <HiSortAscending
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
      />

      <select
        className="input-field pl-9 pr-4 w-44 appearance-none cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
