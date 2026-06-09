// ── API base URL ─────────────────────────────────────────────────────────────
export const API_BASE_URL = 'http://localhost:8080'

// ── JWT storage key ──────────────────────────────────────────────────────────
export const TOKEN_KEY = 'whisperbox_token'

// ── Google OAuth2 login entry point (Spring Boot endpoint) ───────────────────
export const GOOGLE_LOGIN_URL = `${API_BASE_URL}/oauth2/authorization/google`
