import React from 'react'
import { ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // ถ้าใช้ React Router

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const sidebarItems = [
    { 
      name: 'Article management', 
      path: '/admin/article-management',
      icon: '📄' 
    },
    { 
      name: 'Category management', 
      path: '/admin/category-management',
      icon: '📁' 
    },
    { 
      name: 'Profile', 
      path: '/admin/profile',
      icon: '👤' 
    },
    { 
      name: 'Notification', 
      path: '/admin/notification',
      icon: '🔔' 
    },
    { 
      name: 'Reset password', 
      path: '/admin/reset-password',
      icon: '🔑' 
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-[280px] bg-white shadow-sm">
      <div className="p-6">
        <div className="text-2xl font-bold text-gray-800 mb-2">hh.</div>
        <div className="text-sm text-orange-400 font-medium">Admin panel</div>
      </div>
      
      <nav className="mt-8">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center px-6 py-3 text-sm cursor-pointer transition-colors ${
              location.pathname === item.path
                ? 'bg-gray-100 text-gray-900 border-r-2 border-gray-800' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </div>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 w-[280px] p-6 border-t">
        <div className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-800 mb-3">
          <ExternalLink className="w-4 h-4 mr-3" />
          hh. website
        </div>
        <div className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-800">
          <span className="mr-3">🚪</span>
          Log out
        </div>
      </div>
    </div>
  )
}

export default SideBar