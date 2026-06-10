import api from './axiosInstance'
import type { UserInfo } from './authService'

// ─────────────────────────────────────────────────────────────────────────────
// userService — user-focused API calls.
//
// Separation of concerns:
//   authService  → authentication flow (token, login, logout, session check)
//   userService  → user profile and user-related data queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a user's public profile by their ID.
 *
 * Note: The backend does not currently expose a GET /api/users/:id endpoint.
 * This function is a clean placeholder that follows the same pattern as the
 * other services and will work as soon as the endpoint is added.
 *
 * Endpoint: GET /api/users/:id  (to be added to backend if needed)
 */
export const getUserById = (id: number): Promise<UserInfo> =>
  api.get<UserInfo>(`/api/users/${id}`).then((res) => res.data)

/**
 * Fetch the current user's own profile.
 * This re-exports the same GET /api/auth/me call but lives in userService
 * so pages that only need "my profile" data can import from a single place.
 *
 * Endpoint: GET /api/auth/me
 */
export const getMyProfile = (): Promise<UserInfo> =>
  api.get<UserInfo>('/api/auth/me').then((res) => res.data)
