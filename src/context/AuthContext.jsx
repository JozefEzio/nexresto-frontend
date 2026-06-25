import api from '../lib/axios'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
      setIsAuth(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/user')
      setUser(response.data)
      setIsAuth(true)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuth(false)
  }

  const handleLogin = async (email, password, rememberMe = false) => {
    try {
      const response = await api.post('/login', { email, password, remember_me: rememberMe })
      const token = response.data.token
      if (rememberMe) {
        localStorage.setItem('auth_token', token)
      } else {
        sessionStorage.setItem('auth_token', token)
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(response.data.user)
      setIsAuth(true)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Login failed'
    }
  }

  const handleRegister = async (fullName, email, password, confirmPassword) => {
    try {
      const response = await api.post('/register', {
        name: fullName,
        email,
        password,
        password_confirmation: confirmPassword,
      })
      const token = response.data.token
      localStorage.setItem('auth_token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(response.data.user)
      setIsAuth(true)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed'
    }
  }

  return (
    <AuthContext.Provider value={{ handleLogin, logout, user, setUser, loading, handleRegister, isAuth }}>
      {children}
    </AuthContext.Provider>
  )
}