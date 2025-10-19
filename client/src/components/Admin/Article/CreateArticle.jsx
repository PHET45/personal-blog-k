import React, { useState, useEffect } from 'react'
import { Image } from 'lucide-react'
import SideBar from '../SideBar.jsx'
import { useNavigate } from 'react-router-dom'
import { getStatuses, createPost, uploadImage } from '@/services/blogService.js'
import { getCategories } from '@/services/categoriesService.js'
import { toast } from 'react-toast'

const CreateArticle = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [statuses, setStatuses] = useState([])
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false) 
  const [error, setError] = useState(null)

  // Fetch categories and statuses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, statusesData] = await Promise.all([
          getCategories(),
          getStatuses()
        ])
        setCategories(categoriesData)
        setStatuses(statusesData)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load categories and statuses')
      }
    }
    fetchData()
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setThumbnailPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (status) => {
    setLoading(true)
    setError(null)

    try {
      // Validation
      if (!title.trim()) {
        throw new Error('Title is required')
      }
      if (!categoryId) {
        throw new Error('Please select a category')
      }
      if (!introduction.trim()) {
        throw new Error('Introduction is required')
      }
      if (!content.trim()) {
        throw new Error('Content is required')
      }

      // Find status ID based on status name
      const statusObj = statuses.find(s => s.status === status)
      if (!statusObj) {
        throw new Error('Invalid status')
      }

      // 🆕 Upload image ถ้ามี
      let imageUrl = null
      if (thumbnailPreview) {
        try {
          setUploadingImage(true)
          console.log('📤 Uploading image...')
          
          const uploadResult = await uploadImage(thumbnailPreview)
          imageUrl = uploadResult.url
          
          console.log('✅ Image uploaded:', imageUrl)
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr)
          throw new Error('Failed to upload image: ' + uploadErr.message)
        } finally {
          setUploadingImage(false)
        }
      }

      // Prepare post data
      const postData = {
        title: title.trim(),
        description: introduction.trim(),
        content: content.trim(),
        category_id: parseInt(categoryId),
        status_id: statusObj.id,
        image: imageUrl, // 🆕 ใช้ URL จาก Supabase
        date: new Date().toISOString(),
        likes_count: 0
      }

      // Create post
    await createPost(postData)

    // ✅ Show toast based on status
    if (status === 'draft') {
      toast.success('Create article and saved as draft. You can publish article later.')
    } else if (status === 'publish') {
      toast.success('Create article and published. Your article has been successfully published.')
    }

    navigate('/admin/article-management')
  } catch (err) {
    console.error('Error saving post:', err)
    toast.error(err.message || 'Failed to save article')
    setError(err.message || 'Failed to save article')
  } finally {
    setLoading(false)
    setUploadingImage(false)
  }
}

  const handleSaveAsDraft = () => handleSave('draft')
  const handleSaveAndPublish = () => handleSave('publish')

  return (
    <div className="min-h-screen ml-[280px] bg-[#F9F8F6]">
      <SideBar />

      {/* Header */}
      <div className="flex justify-between items-center px-15 border-b-1 border-stone-200 h-[96px]">
        <h1 className="text-2xl font-semibold text-gray-800">Create article</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSaveAsDraft}
            disabled={loading || uploadingImage}
            className="lg:h-[48px] px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save as draft'}
          </button>
          <button
            onClick={handleSaveAndPublish}
            disabled={loading || uploadingImage}
            className="lg:h-[48px] px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingImage ? 'Uploading image...' : loading ? 'Publishing...' : 'Save and publish'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-15 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-900 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Uploading Status */}
      {uploadingImage && (
        <div className="mx-15 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading image to cloud storage...</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-15 w-full">
        <div className="space-y-6">
          {/* Thumbnail Image */}
          <div className="bg-[#F9F8F6] w-[771px] h-[300px] flex items-end gap-x-10">
            <div className="flex flex-col">
              <div className="h-[40px] font-poppins font-medium text-[#75716B] leading-6 tracking-normal">
                Thumbnail Image
              </div>
              <div
                className="bg-[#EFEEEB] w-[460px] h-[260px] flex flex-col items-center justify-center rounded-lg shadow-sm border border-[#DAD6D1] border-dashed cursor-pointer"
                onClick={() => document.getElementById('thumbnailInput').click()}
              >
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-[460px] h-[260px] object-cover rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setThumbnailPreview(null)
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg h-48 flex flex-col items-center justify-center">
                    <Image className="w-12 h-12 text-gray-400 mb-4" />
                  </div>
                )}
              </div>
            </div>

            <label className="cursor-pointer">
              <input
                id="thumbnailInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors hover:cursor-pointer"
                onClick={() => document.getElementById('thumbnailInput').click()}
              >
                Upload thumbnail image
              </button>
            </label>
          </div>

          {/* Category */}
          <div className="rounded-lg w-[480px] h-[76px]">
            <label className="font-poppins font-medium text-[#75716B] leading-6 tracking-normal">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author name */}
          <div className="flex flex-col w-[480px] h-[76px]">
            <div className="font-poppins font-medium text-[#75716B] leading-6 tracking-normal">
              Author name
            </div>
            <input
              type="text"
              placeholder="Enter author name"
              className="flex w-full bg-[#EFEEEB] text-base outline-none border rounded-md px-3 py-2 border-gray-300 text-black placeholder-gray-400 h-[48px]"
            />
          </div>

          {/* Article Title */}
          <div className="w-[1,040px] h-[76px]">
            <label className="font-poppins font-medium text-[#75716B] leading-6 tracking-normal">
              Title *
            </label>
            <input
              type="text"
              placeholder="Article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 bg-white rounded-lg focus:outline-none"
            />
          </div>

          {/* Introduction */}
          <div className="flex flex-col w-[1,040px] h-[171px]">
            <label className="font-poppins font-medium text-[#75716B] leading-6 tracking-normal">
              Introduction (max 120 letters) *
            </label>
            <textarea
              placeholder="Introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              maxLength={120}
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white"
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {introduction.length}/120
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col w-[1,040px] h-[600px]">
            <label className="font-poppins font-medium text-[#75716B] leading-6 tracking-normal">
              Content *
            </label>
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateArticle