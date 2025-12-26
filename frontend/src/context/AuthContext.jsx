import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useSocket } from './SocketContext'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const { socket } = useSocket()

  const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' }
  })

  api.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  const signup = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password })
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('token', data.token)
      if (socket) {
        socket.emit('joinTenant', data.user.id)
      }
      return { success: true }
    } catch (error) {
      console.error('Signup error:', error.response?.data)
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      }
    }
  }

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('token', data.token)
      if (socket) {
        socket.emit('joinTenant', data.user.id)
      }
      return { success: true }
    } catch (error) {
      console.error('Login error:', error.response?.data)
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials'
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    if (socket) socket.disconnect()
  }

  const loadUser = async () => {
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await api.get('/auth/profile')
      setUser(data.user)
      if (socket) socket.emit('joinTenant', data.user.id)
    } catch (error) {
      console.error('Load user error:', error.response?.data)
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        loading,
        api
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
