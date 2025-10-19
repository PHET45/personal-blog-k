import { useState } from 'react'
import SideBar from '../SideBar'
import { AuthService } from '@/services/auth'

const AdminResetPassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.currentPassword.trim()) {
      setError('Current password is required')
      return
    }

    if (!formData.newPassword.trim()) {
      setError('New password is required')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password')
      return
    }

    // Show confirmation modal
    setShowConfirmModal(true)
  }

  const handleConfirmReset = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      setShowConfirmModal(false)

      await AuthService.changePassword(formData.currentPassword, formData.newPassword)
      
      setSuccess('Password changed successfully! 🎉')
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      console.error('Change password error:', err)
      setError(err.response?.data?.message || err.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen ml-[280px] bg-[#F9F8F6]">
      <SideBar />

      {/* Header */}
      <div className="flex justify-between items-center px-15 border-b border-stone-200 h-[96px]">
        <h1 className="text-2xl font-semibold text-gray-800">
          Reset Password{' '}
        </h1>
        <div className="flex gap-3">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="lg:w-[120px] lg:h-[48px] px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-15 w-full">
        {/* Alert Messages */}
        {error && (
          <div className="w-full max-w-2xl mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
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
          <div className="w-full max-w-2xl mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Current password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm placeholder:text-gray-400"
                placeholder="Current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.current ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              New password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm placeholder:text-gray-400"
                placeholder="New password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.new ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Confirm new password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm placeholder:text-gray-400"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.confirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-xl">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
              Reset password
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Do you want to reset your password?
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
                className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                disabled={loading}
                className="px-8 py-2.5 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminResetPassword