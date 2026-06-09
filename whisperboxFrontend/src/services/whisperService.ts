import api from './axiosInstance'

// ── Types matching the Spring Boot Whisper entity ────────────────────────────
export interface Whisper {
  id: number
  title: string
  content: string
  status: 'NOT_SEEN' | 'SEEN'
  createdAt: unknown          // array or string from backend
  anonymousName: string | null
  createdBy: { id: number; anonymousName: string } | null
}

export interface WhisperPage {
  content: Whisper[]
  totalPages: number
  totalElements: number
  number: number             // current page (0-indexed)
  size: number
}

export interface CreateWhisperPayload {
  title: string
  content: string
}

// ── API calls ────────────────────────────────────────────────────────────────

/** Get paginated whispers */
export const getWhispers = (
  page = 0, size = 10, sortBy = 'createdAt', direction = 'desc'
) =>
  api.get<WhisperPage>('/api/whispers', {
    params: { page, size, sortBy, direction },
  })

/** Get single whisper by ID */
export const getWhisperById = (id: number) =>
  api.get<Whisper>(`/api/whispers/${id}`)

/** Create new whisper */
export const createWhisper = (payload: CreateWhisperPayload) =>
  api.post<Whisper>('/api/whispers', payload)

/** Update existing whisper */
export const updateWhisper = (id: number, payload: CreateWhisperPayload) =>
  api.put<Whisper>(`/api/whispers/${id}`, payload)

/** Delete whisper */
export const deleteWhisper = (id: number) =>
  api.delete<string>(`/api/whispers/${id}`)

/** Mark whisper as seen */
export const markAsSeen = (id: number) =>
  api.put<Whisper>(`/api/whispers/${id}/seen`)
