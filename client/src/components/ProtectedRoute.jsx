import React, { useContext } from 'react'
import { AuthContext } from '@/context/AuthContextObject'


export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useContext(AuthContext)
  

  if (loading) return <div>Loading...</div>

  if (!user) return <Navigate to="/login" replace />

  const userRole = user.app_metadata?.role || user.role
  console.log('ProtectedRoute userRole:', userRole)
  console.log('Allowed roles:', roles)

  // ถ้า roles ถูกกำหนดและ userRole ไม่อยู่ใน roles → block
  if (roles && !roles.includes(userRole)) {
    console.log('Access denied, redirecting...')
    return <Navigate to="/" replace />
  }

  // ถ้า role ผ่าน → render children
  return children
}
