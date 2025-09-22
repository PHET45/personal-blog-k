import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '@/context/AuthContextObject'

export default function ProtectedRoute({ children, roles }) {
  const { user } = useContext(AuthContext)

  // ถ้าไม่ได้ login
  if (!user) {
    return <Navigate to="/login" />
  }

  // ถ้ามีการตรวจ role เช่น admin
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />
  }

  return children
}
