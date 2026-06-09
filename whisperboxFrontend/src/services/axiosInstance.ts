import axios from 'axios'
import { API_BASE_URL, TOKEN_KEY } from '../utils/constants'

/**
 * Global Axios instance
 * — points to the Spring Boot backend
 * — automatically attaches the JWT token to every request
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: inject JWT from localStorage before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
