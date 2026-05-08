import axios from 'axios'

/**
 * Centralized Axios instance for all API requests.
 * Base URL is loaded from the VITE_API_URL environment variable.
 * Auth token is injected automatically from localStorage on each request.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Attach the Bearer token to every outgoing request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
