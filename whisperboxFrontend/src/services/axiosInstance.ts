import axios, { AxiosError } from 'axios'
import { API_BASE_URL, TOKEN_KEY } from '../utils/constants'

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance — single source of truth for all HTTP calls to the backend.
// Every service file imports THIS, never creates its own axios instance.
// ─────────────────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── REQUEST interceptor ───────────────────────────────────────────────────────
// Runs before every outgoing request.
// Reads the JWT from localStorage and attaches it to the Authorization header.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── RESPONSE interceptor ──────────────────────────────────────────────────────
// Runs after every response (success or error).
api.interceptors.response.use(
  // Success — just pass the response through unchanged
  (response) => response,

  // Error — extract a readable message, then re-throw
  (error: AxiosError<{ error?: string; [field: string]: string | undefined }>) => {
    const status = error.response?.status

    // 401 Unauthorized — token expired or missing → force back to login
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/'
      return Promise.reject(new Error('Session expired. Please log in again.'))
    }

    // 404 Not Found — backend sends { error: "message" }
    if (status === 404) {
      const msg = error.response?.data?.error ?? 'Resource not found.'
      return Promise.reject(new Error(msg))
    }

    // 400 Bad Request — backend sends { field: "validation message", ... }
    if (status === 400) {
      const data = error.response?.data
      // Join all validation messages into one readable string
      const msg = data
        ? Object.values(data).filter(Boolean).join(' ')
        : 'Invalid request.'
      return Promise.reject(new Error(msg))
    }

    // 403 Forbidden
    if (status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'))
    }

    // Any other error (network failure, 500, etc.)
    const fallback = error.response?.data?.error ?? error.message ?? 'Something went wrong.'
    return Promise.reject(new Error(fallback))
  }
)

export default api
