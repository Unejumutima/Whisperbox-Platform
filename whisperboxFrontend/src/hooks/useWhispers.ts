import { useState, useEffect, useCallback } from 'react'
import { getWhispers } from '../services/whisperService'
import type { Whisper, WhisperPage } from '../services/whisperService'

interface UseWhispersOptions {
  page?: number
  size?: number
  sortBy?: string
  direction?: string
}

interface UseWhispersResult {
  whispers:   Whisper[]
  pageInfo:   Omit<WhisperPage, 'content'> | null
  loading:    boolean
  error:      string | null
  refetch:    () => void
}

/**
 * useWhispers — fetches a page of whispers from the backend.
 *
 * Encapsulates loading / error state so pages stay clean.
 *
 * Usage:
 *   const { whispers, pageInfo, loading, error, refetch } = useWhispers({ page, direction })
 */
export function useWhispers({
  page      = 0,
  size      = 10,
  sortBy    = 'id',
  direction = 'desc',
}: UseWhispersOptions = {}): UseWhispersResult {

  const [whispers, setWhispers] = useState<Whisper[]>([])
  const [pageInfo, setPageInfo] = useState<Omit<WhisperPage, 'content'> | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [tick,     setTick]     = useState(0)  // incrementing this triggers a refetch

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false   // prevent state update on unmounted component

    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getWhispers(page, size, sortBy, direction)
        if (!cancelled) {
          const { content, ...rest } = data
          setWhispers(content)
          setPageInfo(rest)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load whispers.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }

  // Re-run whenever any param or the refetch tick changes
  }, [page, size, sortBy, direction, tick])

  return { whispers, pageInfo, loading, error, refetch }
}
