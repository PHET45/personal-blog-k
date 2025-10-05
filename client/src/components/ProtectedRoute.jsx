import React, { useContext } from 'react'
import { AuthContext } from '@/context/AuthContextObject'
import { Navigate } from 'react-router-dom'
import MetaBalls from '@/components/ui/MetaBalls'
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useContext(AuthContext)

  if (loading)
    return (
      <div className="flex flex-col items-center  h-screen gap-6 lg:py-100">
        <MetaBalls
          color="oklch(89.7% 0.196 126.665)"
          cursorBallColor="oklch(89.7% 0.196 126.665)"
          cursorBallSize={5}
          ballCount={30}
          animationSize={30}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.05}
          clumpFactor={2}
          speed={0.3}
        />
      </div>
    )

  if (!user) return <Navigate to="/login" replace />

  const userRole = user.app_metadata?.role || user.role
 

  // ถ้า roles ถูกกำหนดและ userRole ไม่อยู่ใน roles → block
  if (roles && !roles.includes(userRole)) {
    console.log('Access denied, redirecting...')
    return <Navigate to="/" replace />
  }

  // ถ้า role ผ่าน → render children
  return children
}
