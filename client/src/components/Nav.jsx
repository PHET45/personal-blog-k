import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '@/services/auth'
import { FaBell, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await AuthService.getProfile()
        setUser(profile.user)
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [])

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    AuthService.logout()
    setUser(null)
    setMobileMenuOpen(false)
    navigate('/login')
  }

  return (
    <>
      <nav className="flex justify-between items-center h-[80px] lg:px-88 px-20 border-b border-gray-200 bg-white ">
        {/* Logo */}
        <div>
          <Link to='/'><img src="/logo.svg" alt="logo" /></Link>
        </div>

        {/* Right side - Desktop */}
        <div
          className="hidden md:flex items-center gap-6 relative"
          ref={dropdownRef}
        >
          {user ? (
            <div className="flex items-center gap-2 cursor-pointer">
              {/* Notification bell */}
              <button className="relative">
                <FaBell className="text-xl text-gray-700" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              {/* Avatar */}
              <img
                src={user.user_metadata?.avatar_url}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              {/* Username */}
              <span className="font-medium text-gray-800">
                {user.user_metadata?.name}
              </span>
              <FaChevronDown
                className="text-sm text-gray-500"
                onClick={() => setMenuOpen((v) => !v)}
              />
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login">
                <button className="text-black bg-white px-[40px] py-[12px] rounded-full border">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="text-white bg-gray-800 px-[40px] py-[12px] rounded-full border">
                  Signup
                </button>
              </Link>
            </div>
          )}

          {/* Dropdown menu */}
          {menuOpen && user && (
            <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-xl py-2 border border-gray-100">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                <span>👤</span> Profile
              </Link>
              <Link
                to="/reset-password"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                <span>🔄</span> Reset password
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
              >
                <span>↩️</span> Log out
              </button>
            </div>
          )}
        </div>

        {/* Right side - Mobile */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-2xl text-gray-700"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
      {/* Mobile Full Screen Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Mobile Menu */}
          <div
            className={`fixed top-[64px] left-0 w-full bg-white z-50 box-border overflow-hidden transition-all duration-300 ${
              user ? 'h-[288px]' : 'h-[200px]'
            }`}
          >
            <div className={`flex flex-col px-10 ${user ? 'py-7' : 'py-10'} gap-4`}>
              {user ? (
                <>
                  {/* User Logged In Menu */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-row gap-3 items-center">
                      <img
                        src={user.user_metadata?.avatar_url}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-800 text-lg">
                        {user.user_metadata?.name}
                      </span>
                    </div>
                    <button className="relative">
                      <FaBell className="text-xl text-gray-700" />
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 py-2 text-gray-700 border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">👤</span>
                    <span className="text-base">Profile</span>
                  </Link>

                  <Link
                    to="/reset-password"
                    className="flex items-center gap-3 py-2 text-gray-700 border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">🔄</span>
                    <span className="text-base">Reset password</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-2 text-gray-700 border-b border-gray-100 text-left"
                  >
                    <span className="text-xl">↩️</span>
                    <span className="text-base">Log out</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Non-Logged In Menu */}
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="text-black bg-white px-[40px] py-[12px] rounded-full border w-full">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <button className="text-white bg-gray-800 px-[40px] py-[12px] rounded-full border w-full">
                      Signup
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
