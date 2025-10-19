//components/Profile/Profile.jsx
import React, { useEffect, useState, useRef } from 'react';
import { AuthService } from '@/services/auth';
import { UploadService } from '@/services/upload';
import { Link } from 'react-router-dom';
import { toast } from 'react-toast';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({ name: '', username: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const result = await UploadService.uploadProfilePic(file);
      console.log('Upload result:', result);
      
      setSuccess('Profile picture updated successfully! 🎉');
      
      await fetchProfile();
      
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    const currentName = profileData?.name || user.user_metadata?.name;
    const currentUsername = profileData?.username || user.user_metadata?.username;

    if (formData.name === currentName && formData.username === currentUsername) {
      setError('No changes detected');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const result = await UploadService.updateProfile(formData.name, formData.username);
      console.log('Update result:', result);
      toast.success(
        <div>
          <p className="font-semibold text-lg">
          Saved profile{' '}
          </p>
          <p className="text-sm text-white/90">
          Your profile has been successfully updated
          </p>
        </div>
      )
      setSuccess('Profile updated successfully! 🎉');
      
      await fetchProfile();
      
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const avatarUrl = profileData?.profile_pic || user.user_metadata?.avatar_url || '/default-avatar.png';
  const displayName = profileData?.name || user.user_metadata?.name || 'User';

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 w-full bg-white px-6 lg:px-120 py-8">
      {/* Sidebar */}
      <div className="flex flex-col lg:w-1/4 mb-6 lg:mb-0 bg-white">
        {/* 🔹 nav อยู่ข้างบนใน mobile แต่ใน lg จะอยู่ล่าง */}
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
          <div className="flex flex-row justify-end-safe font-semibold text-gray-800 text-base lg:hidden">
            Profile
          </div>
        </div>

        {/* 🔹 nav สำหรับ desktop (lg ขึ้นไป) */}
        <nav className="hidden lg:flex lg:flex-col gap-2">
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
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center lg:items-start bg-[#f8f8f6] lg:bg-white lg:gap-5 w-full">
        <div className="hidden lg:block text-xl font-semibold">Profile</div>
        
        {/* ✅ Alert Messages */}
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
          {/* Profile Picture Section */}
          <div className="relative mb-4 flex flex-col lg:flex-row gap-4 justify-center items-center">
            <img
              src={avatarUrl}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
             {/* Upload button */}
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className={`border border-gray-400 rounded-full px-5 py-2  font-medium hover:bg-gray-50 bg-white max-lg:mb-6 transition-all min-w-[255px] min-h-[48px] ${
              uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload profile picture'}
          </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

         

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 block mb-1" >
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border bg-[#EFEEEB] border-gray-200 rounded-md px-3 py-2 text-gray-400 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`bg-gray-800 lg:min-w-[120px] lg:min-h-[48px]  cursor-pointer text-white font-medium rounded-full text-sm py-2 px-8 hover:bg-gray-900 mt-4 self-start transition-all ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;