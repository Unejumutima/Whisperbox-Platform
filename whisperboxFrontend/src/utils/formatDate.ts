/**
 * Format a LocalDateTime array from the Spring backend
 * Backend sends: [year, month, day, hour, minute, second, nano]
 * or an ISO string — handle both.
 */
export function formatDate(value: unknown): string {
  if (!value) return '—'

  // Array format from Jackson LocalDateTime serialisation
  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0] = value as number[]
    const date = new Date(year, month - 1, day, hour, minute)
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  // ISO string
  if (typeof value === 'string') {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return String(value)
}
