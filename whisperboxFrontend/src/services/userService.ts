import api from './axiosInstance'
import type { UserInfo } from './authService'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Matches PendingUserDTO returned by GET /api/admin/pending-users */
export interface PendingUser {
  id: number
  email: string
  fullName: string | null
  anonymousName: string | null
  registeredAt: unknown   // LocalDateTime array from Spring Boot
}

// ─────────────────────────────────────────────────────────────────────────────
// General user queries
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch the current user's own profile — GET /api/auth/me */
export const getMyProfile = (): Promise<UserInfo> =>
  api.get<UserInfo>('/api/auth/me').then((res) => res.data)

// ─────────────────────────────────────────────────────────────────────────────
// Admin — user management  (all require ADMIN role)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all users whose approved = false.
 * GET /api/admin/pending-users
 */
export const getPendingUsers = (): Promise<PendingUser[]> =>
  api.get<PendingUser[]>('/api/admin/pending-users').then((res) => res.data)

/**
 * Returns the number of pending users — useful for badge counters.
 * GET /api/admin/pending-users/count
 */
export const getPendingCount = (): Promise<number> =>
  api
    .get<{ pending: number }>('/api/admin/pending-users/count')
    .then((res) => res.data.pending)

/**
 * Approves a user — sets approved = true.
 * PUT /api/admin/users/:id/approve
 */
export const approveUser = (id: number): Promise<void> =>
  api.put(`/api/admin/users/${id}/approve`).then(() => undefined)

/**
 * Rejects and removes a user permanently.
 * PUT /api/admin/users/:id/reject
 */
export const rejectUser = (id: number): Promise<void> =>
  api.put(`/api/admin/users/${id}/reject`).then(() => undefined)
