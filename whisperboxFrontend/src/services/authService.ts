import api from './axiosInstance'
import { TOKEN_KEY } from '../utils/constants'

// ─────────────────────────────────────────────────────────────────────────────
// Types — match the backend UserInfoDTO exactly
// ─────────────────────────────────────────────────────────────────────────────

/** Matches UserInfoDTO returned by GET /api/auth/me */
export interface UserInfo {
  id: number
  email: string
  anonymousName: string | null  // null for ADMIN users — always handle this in UI
  role: 'STUDENT' | 'ADMIN'
}

// ─────────────────────────────────────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the currently authenticated user's profile.
 * The JWT in localStorage is attached automatically by the Axios interceptor.
 *
 * Endpoint: GET /api/auth/me
 */
export const getCurrentUser = (): Promise<UserInfo> =>
  api.get<UserInfo>('/api/auth/me').then((res) => res.data)

/**
 * Ping the backend to verify the JWT is still valid.
 * Useful on app startup to check session before fetching user data.
 *
 * Endpoint: GET /api/auth/status
 * Returns: "Authenticated" string
 */
export const checkAuthStatus = (): Promise<string> =>
  api.get<string>('/api/auth/status').then((res) => res.data)

// ─────────────────────────────────────────────────────────────────────────────
// Token helpers — pure localStorage operations, no HTTP
// ─────────────────────────────────────────────────────────────────────────────

/** Save JWT token to localStorage after OAuth2 callback */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

/** Read JWT token from localStorage */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

/** Remove JWT and clear session (client-side logout) */
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

/** Check if a token exists in localStorage */
export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY)
}
