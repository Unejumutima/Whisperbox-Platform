import api from './axiosInstance'

// ── Type matching UserInfoDTO from Spring Boot ───────────────────────────────
export interface UserInfo {
  id: number
  email: string
  anonymousName: string
  role: 'STUDENT' | 'ADMIN'
}

/** Fetch current authenticated user — requires JWT in header */
export const getCurrentUser = () =>
  api.get<UserInfo>('/api/auth/me')
