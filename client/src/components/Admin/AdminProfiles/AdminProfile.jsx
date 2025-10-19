import SideBar from '../SideBar'
import React, { useEffect, useState, useRef } from 'react'
import { AuthService } from '@/services/auth'
import { UploadService } from '@/services/upload'
const AdminProfile = () => {
  const [user, setUser] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const authProfile = await AuthService.getProfile()
      setUser(authProfile.user)

      try {
        const customProfile = await UploadService.getProfile()
        setProfileData(customProfile.profile)

        setFormData({
          name:
            customProfile.profile?.name ||
            authProfile.user.user_metadata?.name ||
            '',
          username:
            customProfile.profile?.username ||
            authProfile.user.user_metadata?.username ||
            '',
          bio: customProfile.profile?.bio || '',
        })
      } catch {
        setFormData({
          name: authProfile.user.user_metadata?.name || '',
          username: authProfile.user.user_metadata?.username || '',
          bio: '',
        })
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err.message)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, GIF)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    try {
      setUploading(true)
      setError('')
      setSuccess('')

      const result = await UploadService.uploadProfilePic(file)
      console.log('Upload result:', result)

      setSuccess('Profile picture updated successfully! 🎉')

      await fetchProfile()

      setTimeout(() => {
        setSuccess('')
      }, 2000)
    } catch (err) {
      console.error('Upload error:', err)
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to upload profile picture'
      )
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (!formData.username.trim()) {
      setError('Username is required')
      return
    }

    const currentName = profileData?.name || user?.user_metadata?.name
    const currentUsername =
      profileData?.username || user?.user_metadata?.username
    const currentBio = profileData?.bio || ''

    if (
      formData.name === currentName &&
      formData.username === currentUsername &&
      formData.bio === currentBio
    ) {
      setError('No changes detected')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const result = await UploadService.updateProfile(
        formData.name,
        formData.username,
        formData.bio
      )
      console.log('Update result:', result)

      setSuccess('Profile updated successfully! 🎉')

      await fetchProfile()

      setTimeout(() => {
        setSuccess('')
      }, 2000)
    } catch (err) {
      console.error('Update error:', err)
      setError(
        err.response?.data?.message || err.message || 'Failed to update profile'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  if (!user) {
    return (
      <div className="min-h-screen ml-[280px] bg-[#F9F8F6] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const avatarUrl =
    profileData?.profile_pic ||
    user.user_metadata?.avatar_url ||
    '/default-avatar.png'

  return (
    <div className="min-h-screen ml-[280px] bg-[#F9F8F6]">
      <SideBar />

      {/* Header */}
      <div className="flex justify-between items-center px-15 border-b border-stone-200 h-[96px]">
        <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>

        <div className="flex gap-3">
          <button 
          onClick={handleSubmit}
          disabled={saving}
          className="lg:w-[120px] lg:h-[48px] px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-15 w-full">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-red-700">❌ {error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-green-700">✅ {success}</span>
              <button
                onClick={() => setSuccess('')}
                className="ml-auto text-green-500 hover:text-green-700 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Profile Form Container */}
        <div className="bg-[#F9F8F6] rounded-lg p-8 ">
          {/* Profile Picture Section */}
          <div className="flex flex-row w-[480px] items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="profile"
                className="w-[120px] h-[120px] rounded-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center ">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload button */}
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className={`lg:w-[255px] bg-white lg:h-[48px] border border-gray-400 rounded-full px-6 py-2 text-sm font-normal hover:bg-gray-50 transition-all ${
                  uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {uploading ? 'Uploading...' : 'Upload profile picture'}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 max-w-[1040px]">
            <div>
              <label className="text-sm font-normal text-gray-700 block mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className=" border min-w-[480px] bg-white  border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                placeholder="Thompson P."
              />
            </div>

            <div>
              <label className="text-sm font-normal text-gray-700 block mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="min-w-[480px] border bg-white  border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                placeholder="thompson"
              />
            </div>

            <div>
              <label className="text-sm font-normal text-gray-700 block mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="min-w-[480px] bg-white  border border-gray-200 rounded-lg px-4 py-3 text-gray-400  cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-normal text-gray-700 block mb-2">
                Bio (max 120 letters)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                maxLength={120}
                rows={4}
                className="w-full bg-white  border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm resize-none"
                placeholder="I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.&#10;&#10;When I'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
