import api from './axiosInstance'

// ─────────────────────────────────────────────────────────────────────────────
// Types — match the backend Whisper entity and Spring Page<T> structure exactly
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Spring Boot serialises LocalDateTime as a number array:
 * [year, month, day, hour, minute, second, nanosecond]
 * We keep it as unknown here and format it in the UI layer via formatDate().
 */
export type LocalDateTimeArray = number[]

/** Matches the Whisper entity returned directly by the backend */
export interface Whisper {
  id: number
  title: string
  content: string
  status: 'NOT_SEEN' | 'SEEN'
  createdAt: LocalDateTimeArray | null
  anonymousName: string | null
  createdBy: {
    id: number
    email: string
    anonymousName: string | null
  } | null
}

/**
 * Spring Boot's Page<Whisper> response shape.
 * The paginated GET /api/whispers response always has this structure.
 */
export interface WhisperPage {
  content: Whisper[]
  totalPages: number
  totalElements: number
  number: number   // current page, 0-indexed
  size: number
  first: boolean
  last: boolean
}

/** Request body for POST /api/whispers and PUT /api/whispers/:id */
export interface WhisperPayload {
  title: string
  content: string
}

// ─────────────────────────────────────────────────────────────────────────────
// API calls — one function per endpoint
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch whispers belonging to the currently logged-in user.
 * Uses the new GET /api/whispers/mine endpoint.
 * Supports server-side pagination and sorting.
 */
export const getMyWhispers = (
  page      = 0,
  size      = 10,
  sortBy    = 'createdAt',
  direction = 'desc'
): Promise<WhisperPage> =>
  api
    .get<WhisperPage>('/api/whispers/mine', { params: { page, size, sortBy, direction } })
    .then((res) => res.data)

/**
 * Fetch a page of whispers.
 *
 * Endpoint: GET /api/whispers?page=0&size=10&sortBy=createdAt&direction=desc
 */
export const getWhispers = (
  page      = 0,
  size      = 10,
  sortBy    = 'id',
  direction = 'desc'
): Promise<WhisperPage> =>
  api
    .get<WhisperPage>('/api/whispers', { params: { page, size, sortBy, direction } })
    .then((res) => res.data)

/**
 * Fetch a single whisper by its ID.
 *
 * Endpoint: GET /api/whispers/:id
 */
export const getWhisperById = (id: number): Promise<Whisper> =>
  api.get<Whisper>(`/api/whispers/${id}`).then((res) => res.data)

/**
 * Create a new whisper. The backend sets status=NOT_SEEN and createdAt automatically.
 *
 * Endpoint: POST /api/whispers
 */
export const createWhisper = (payload: WhisperPayload): Promise<Whisper> =>
  api.post<Whisper>('/api/whispers', payload).then((res) => res.data)

/**
 * Update title and content of an existing whisper.
 *
 * Endpoint: PUT /api/whispers/:id
 */
export const updateWhisper = (id: number, payload: WhisperPayload): Promise<Whisper> =>
  api.put<Whisper>(`/api/whispers/${id}`, payload).then((res) => res.data)

/**
 * Permanently delete a whisper.
 *
 * Endpoint: DELETE /api/whispers/:id
 * Returns: "Whisper deleted successfully" string
 */
export const deleteWhisper = (id: number): Promise<string> =>
  api.delete<string>(`/api/whispers/${id}`).then((res) => res.data)

/**
 * Mark a whisper's status as SEEN.
 *
 * Endpoint: PUT /api/whispers/:id/seen
 */
export const markAsSeen = (id: number): Promise<Whisper> =>
  api.put<Whisper>(`/api/whispers/${id}/seen`).then((res) => res.data)
