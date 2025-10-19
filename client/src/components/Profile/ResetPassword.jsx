import React, { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth';
import { Link } from 'react-router-dom';
import { UploadService } from '@/services/upload';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const authProfile = await AuthService.getProfile();
      setUser(authProfile.user);
      
      try {
        const customProfile = await UploadService.getProfile();
        setProfileData(customProfile.profile);
        
        setFormData({
          name: customProfile.profile?.name || authProfile.user.user_metadata?.name || '',
          username: customProfile.profile?.username || authProfile.user.user_metadata?.username || '',
        });
      } catch  {
        setFormData({
          name: authProfile.user.user_metadata?.name || '',
          username: authProfile.user.user_metadata?.username || '',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.currentPassword.trim()) {
      setError('Current password is required');
      return;
    }

    if (!formData.newPassword.trim()) {
      setError('New password is required');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await AuthService.changePassword(formData.currentPassword, formData.newPassword);
      
      setSuccess('Password changed successfully! 🎉');
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Change password error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = profileData?.profile_pic || user?.user_metadata?.avatar_url || '/default-avatar.png' ;
  const displayName = profileData?.name ;

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 w-full bg-white px-6 lg:px-120 py-8">
      {/* Sidebar */}
      <div className="flex flex-col lg:w-1/4 mb-6 lg:mb-0 bg-white">
        <nav className="flex lg:hidden gap-2 mb-4">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            <img src='https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/User_duotone.svg' alt='profile'/> Profile
          </Link>
          <Link
            to="/reset-password"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            <img src='https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Refresh_light.svg' alt='reset-pass'/> Reset password
          </Link>
        </nav>

         {/* Avatar + name */}
         <div className="flex flex-row items-center gap-3 mb-6">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-[#75716B] text-base lg:text-lg">
            {displayName}
          </span> 
          <div className=" text-[#DAD6D1]">|</div>
          <div className='lg:hidden font-semibold text-gray-800 text-base '>Reset password</div>
        </div>

        <nav className="hidden lg:flex lg:flex-col gap-2">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            <img src='https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/User_duotone.svg' alt='profile'/> Profile
          </Link>
          <Link
            to="/reset-password"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 bg-gray-100"
          >
            <img src='https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/Refresh_light.svg' alt='reset-pass'/> Reset password
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center lg:items-start bg-[#f8f8f6] lg:bg-white lg:gap-5 w-full">
        
        <div className="hidden lg:block text-xl font-semibold">Reset Password</div>
        
        {/* Alert Messages */}
        {error && (
          <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 rounded">
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
          <div className="w-full bg-green-50 border-l-4 border-green-500 p-4 rounded">
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

        <div className="lg:bg-[#EFEEEB] flex flex-col items-center lg:items-start lg:rounded-2xl lg:shadow-sm p-6 lg:min-w-[550px] w-full">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 max-w-md">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Enter current password"
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
              <label className="text-sm font-medium text-gray-700 block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Enter new password"
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
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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

            <button
              type="submit"
              disabled={loading}
              className={`bg-gray-800 lg:min-w-[120px] lg:min-h-[48px] cursor-pointer text-white font-medium rounded-full text-sm py-2 px-8 hover:bg-gray-900 mt-4 self-start transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;