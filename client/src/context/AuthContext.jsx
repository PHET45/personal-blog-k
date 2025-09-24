import React, { useState, useEffect } from 'react'
import { AuthService } from '@/services/auth'
import { AuthContext } from './AuthContextObject'


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // 👈 เพิ่ม state โหลด
  const login = async (email, password) => {
    const data = await AuthService.login(email, password)
    if (data.token) {
      const profile = await AuthService.getProfile()
      setUser(profile.user)
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
        setUser(profile.user)
      } catch {
        logout()
      } finally {
        setLoading(false) // ✅ รู้แล้วว่าเสร็จ
      }
    }
    fetchProfile()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
