import React, { useEffect, useState } from 'react'
import { AuthService } from '@/services/auth'
import { Link } from 'react-router-dom'

const Profile = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await AuthService.getProfile()
        setUser(profile.user)
        console.log('user', profile.user)
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [])

  if (!user) return null

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 w-full  bg-white px-6 lg:px-120 py-8">
      {/* Sidebar */}
      <div className="flex flex-col lg:w-1/4 mb-6 lg:mb-0 bg-white">
        {/* 🔹 nav อยู่ข้างบนใน mobile แต่ใน lg จะอยู่ล่าง */}
        <nav className="flex lg:hidden gap-2 mb-4">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            👤 Profile
          </Link>
          <Link
            to="/reset-password"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            🔄 Reset password
          </Link>
        </nav>

        {/* Avatar + name */}
        <div className="flex flex-row items-center gap-3 mb-6">
          <img
            src={user.user_metadata?.avatar_url || '/default-avatar.png'}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-gray-800 text-base lg:text-lg">
            {user.user_metadata?.name}
          </span>
          <div className="lg:hidden text-[#DAD6D1]">|</div>
          <div className="flex flex-row justify-end-safe  lg:hidden">
            Profile
          </div>
        </div>

        {/* 🔹 nav สำหรับ desktop (lg ขึ้นไป) */}
        <nav className="hidden lg:flex lg:flex-col gap-2">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            👤 Profile
          </Link>
          <Link
            to="/reset-password"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            🔄 Reset password
          </Link>
        </nav>
      </div>
      {/* Main content */}
      <div className="flex flex-col items-center lg:items-start bg-[#f8f8f6] lg:bg-white  lg:gap-5 mb:p-6 w-full  ">
        <div className="hidden lg:block">Profile</div>
        <div className="lg:bg-[#f8f8f6] flex flex-col items-center lg:items-start  lg:rounded-2xl lg:shadow-sm p-6 w-full ">
          <img
            src={user.user_metadata?.avatar_url || '/default-avatar.png'}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <button className="border border-gray-400 rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-50 mb-6">
            Upload profile picture
          </button>
          <form className="w-full flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                defaultValue={user.user_metadata?.name}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                defaultValue={user.user_metadata?.username}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-400 bg-gray-50 cursor-not-allowed"
              />
            </div>

            <button
              type="button"
              className="bg-gray-800 text-white font-medium rounded-full text-sm py-2 px-8 hover:bg-gray-900 mt-4 self-start "
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
