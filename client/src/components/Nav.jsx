import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '@/services/auth'
import { UploadService } from '@/services/upload'
import { getNotifications } from '@/services/commentService'
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [hasUnread, setHasUnread] = useState(false)
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await UploadService.getProfile()
        console.log(profile.profile)
        setUser(profile.profile)
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [])

  // Fetch notifications - สำหรับทุกคนที่ login
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const data = await getNotifications()
          setNotifications(data)

          // Check if there are unread notifications
          const lastViewedTime = localStorage.getItem('lastViewedNotifications')
          if (data.length > 0) {
            if (!lastViewedTime) {
              setHasUnread(true)
            } else {
              const hasNewNotification = data.some(
                (notif) => new Date(notif.created_at) > new Date(lastViewedTime)
              )
              setHasUnread(hasNewNotification)
            }
          }
        } catch (err) {
          console.error('Error fetching notifications:', err)
        }
      }
    }

    if (user) {
      fetchNotifications()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

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

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen)
    if (!notificationOpen) {
      // Mark as read when opening
      localStorage.setItem('lastViewedNotifications', new Date().toISOString())
      setHasUnread(false)
    }
  }

  const handleViewAllNotifications = () => {
    setNotificationOpen(false)
    navigate('/admin/notification')
  }

  const handleViewPost = (postId) => {
    setNotificationOpen(false)
    navigate(`/post/${postId}#comments`)
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const commentDate = new Date(timestamp)
    const diffMs = now - commentDate
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
    }

    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    }

    return commentDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }
  const avatarUrl = user?.profile_pic || '/default-avatar.png'
  const displayName = user?.name || 'User'

  return (
    <>
      <nav className="flex justify-between items-center h-[80px] lg:px-88 px-20 border-b border-gray-200 bg-[#F9F8F6] ">
        {/* Logo */}
        <div>
          <Link to="/">
            <img src="/logo.svg" alt="logo" />
          </Link>
        </div>

        {/* Right side - Desktop */}
        <div
          className="hidden md:flex items-center gap-6 relative"
          ref={dropdownRef}
        >
          {user ? (
            <div className="flex items-center gap-5 ">
              {/* 🔔 Notification */}
              <div className="relative" ref={notificationRef}>
                <button
                  className="relative cursor-pointer w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#EFEEEB] transition-colors"
                  onClick={handleNotificationClick}
                >
                  <img
                    src="https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Bell_light.svg"
                    alt="bell"
                    className="w-5 h-5"
                  />
                  {hasUnread && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </button>

                {/* 🔔 Notification Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 top-14 w-[400px] bg-white shadow-lg rounded-xl border border-gray-200 z-[9999] max-h-[500px] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      {user.role === 'admin' && (
                        <button
                          onClick={handleViewAllNotifications}
                          className="text-sm text-black cursor-pointer hover:underline"
                        >
                          View all
                        </button>
                      )}
                    </div>

                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.slice(0, 2).map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleViewPost(notification.post_id)}
                            className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                          >
                            <div className="flex gap-3">
                              <img
                                src={
                                  notification.user?.profile_pic ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                                    notification.user?.name || 'unknown'
                                  }`
                                }
                                alt={notification.user?.name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">
                                  <span className="font-semibold">
                                    {notification.user?.name || 'Unknown User'}
                                  </span>{' '}
                                  commented on an article you commented on.
                                </p>
                                <p className="text-xs text-[#F2B68C] mt-1">
                                  {getTimeAgo(notification.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div
                className="flex  gap-5 items-center "
                onClick={() => setMenuOpen((v) => !v)}
              >
                {/* Avatar */}
                <img
                  src={user.profile_pic}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                {/* Username */}
                <span className="font-medium text-gray-800">{user.name}</span>
                <FaChevronDown className="text-sm text-gray-500" />
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login">
                <button className="text-black cursor-pointer bg-white min-w-[127px] min-h-[48px] rounded-full border">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="text-white cursor-pointer bg-gray-800 min-w-[127px] min-h-[48px] rounded-full border">
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
                <img
                  src="https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/User_duotone.svg"
                  alt="profile"
                />{' '}
                Profile
              </Link>
              <Link
                to="/reset-password"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                <img
                  src="https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Refresh_light.svg"
                  alt="reset-pass"
                />{' '}
                Reset password
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin/article-management"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 "
                  onClick={() => setMenuOpen(false)}
                >
                  <img
                    src="https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Out_light.svg"
                    alt="admin-panel"
                  />
                  Admin panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left border-t border-[#DAD6D1]"
              >
                <img
                  src="https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Sign_out_squre_light.svg"
                  alt="logout"
                />{' '}
                Log out
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
            <div
              className={`flex flex-col px-10 ${user ? 'py-7' : 'py-10'} gap-4`}
            >
              {user ? (
                <>
                  {/* User Logged In Menu */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-row gap-3 items-center">
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-800 text-lg">
                        {displayName}
                      </span>
                    </div>
                    {/* 🔔 Notification */}
                    <div className="relative" ref={notificationRef}>
                      <button
                        className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#EFEEEB] transition-colors"
                        onClick={handleNotificationClick}
                      >
                        <img
                          src="https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Bell_light.svg"
                          alt="bell"
                          className="w-5 h-5"
                        />
                        {hasUnread && (
                          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                        )}
                      </button>

                      {/* 🔔 Notification Dropdown */}
                      {notificationOpen && (
                        <div className="absolute px-2 py-2 right-[-10px] top-14 min-w-[343px] bg-white shadow-lg rounded-xl border border-gray-200 z-[9999] max-h-[208px] overflow-hidden flex flex-col">
                          <div className="overflow-y-auto ">
                            {notifications.length === 0 ? (
                              <div className="p-6 text-center text-gray-500">
                                <p>No notifications</p>
                              </div>
                            ) : (
                              notifications.slice(0, 2).map((notification) => (
                                <div
                                  key={notification.id}
                                  onClick={() =>
                                    handleViewPost(notification.post_id)
                                  }
                                  className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                                >
                                  <div className="flex gap-3">
                                    <img
                                      src={
                                        notification.user?.profile_pic ||
                                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                                          notification.user?.name || 'unknown'
                                        }`
                                      }
                                      alt={notification.user?.name}
                                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-900">
                                        <span className="font-semibold">
                                          {notification.user?.name ||
                                            'Unknown User'}
                                        </span>{' '}
                                        commented on an article you commented
                                        on.
                                      </p>
                                      <p className="text-xs text-[#F2B68C] mt-1">
                                        {getTimeAgo(notification.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 py-2 text-gray-700 border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <img
                      src="https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/User_duotone.svg"
                      alt="profile"
                    />
                    <span className="text-base">Profile</span>
                  </Link>

                  <Link
                    to="/reset-password"
                    className="flex items-center gap-3 py-2 text-gray-700 border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <img
                      src="https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Refresh_light.svg"
                      alt="reset-pass"
                    />
                    <span className="text-base">Reset password</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-2 text-gray-700 border-b border-gray-100 text-left"
                  >
                    <img
                      src="https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Sign_out_squre_light.svg"
                      alt="logout"
                    />
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
