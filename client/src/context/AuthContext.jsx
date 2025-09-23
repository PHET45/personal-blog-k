import React, { useState, useEffect } from 'react'
import { AuthService } from '@/services/auth'
import { AuthContext } from './AuthContextObject'


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    const data = await AuthService.login(email, password)
    if (data.token) {
      const profile = await AuthService.getProfile()
      setUser(profile)
    }
    return data
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await AuthService.getProfile()
        setUser(profile)
      } catch {
        logout()
      }
    }
    fetchProfile()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
