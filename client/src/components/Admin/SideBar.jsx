import React, { useContext } from 'react'
import { ExternalLink } from 'lucide-react'
import { useNavigate, useLocation, Link } from 'react-router-dom' // ถ้าใช้ React Router
import { AuthContext } from '@/context/AuthContextObject'

const SideBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useContext(AuthContext)

  const sidebarItems = [
    {
      name: 'Article management',
      path: '/admin/article-management',
      icon: <img src='https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/notebook_light.svg' alt='note'/ >,
    },
    {
      name: 'Category management',
      path: '/admin/category-management',
      icon: <img src='https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/File_light.svg' alt='file'/>,
    },
    {
      name: 'Profile',
      path: '/admin/profile',
      icon: <img src='https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/User_duotone.svg' alt='profile'/>,
    },
    {
      name: 'Notification',
      path: '/admin/notification',
      icon: <img src='https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Bell_light.svg' alt='bell'/>,
    },
    {
      name: 'Reset password',
      path: '/admin/reset-password',
      icon: <img src='https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Bell_light.svg' alt='bell'/>,
    },
  ]

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-[280px] bg-[#EFEEEB] shadow-sm">
      <div className="h-[212px] flex flex-col items-start justify-center px-7">
        <Link to='/'><img src='/logo.svg' alt='logo'/></Link>
        <div className="text-sm text-orange-400 font-medium">Admin panel</div>
      </div>

      <nav className="flex flex-col">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center px-6 py-6 text-sm cursor-pointer transition-colors ${
              location.pathname.startsWith(item.path)
                ? 'bg-[#DAD6D1] text-gray-900'
                : 'text-gray-600 hover:bg-[#DAD6D1] '
            }`}
            
            
            
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </div>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 w-[280px] p-6  border-gray-200">
        <div className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-800 mb-3 border-b border-gray-200 pb-3">
        <Link to="/">
        <div className='flex items-center'><ExternalLink className="w-4 h-4 mr-3" /> hh. website</div>
        </Link>
        </div>
        <div
          className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-800"
          onClick={handleLogout}
        >
          <span className="mr-3">🚪</span>
          Log out
        </div>
      </div>
    </div>
  )
}

export default SideBar
