import React, { useState, useEffect } from 'react'
import { Image } from 'lucide-react'
import SideBar from '../SideBar.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { getStatuses, getBlogById, updatePost, uploadImage } from '@/services/blogService.js'
import { getCategories } from '@/services/categoriesService.js'

const EditArticle = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [statuses, setStatuses] = useState([])
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState(null)

  // 🔹 โหลดข้อมูลบทความ
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        const [postData, categoriesData, statusesData] = await Promise.all([
          getBlogById(id),
          getCategories(),
          getStatuses()
        ])

        setTitle(postData.title || '')
        setIntroduction(postData.description || '')
        setContent(postData.content || '')
        setCategoryId(postData.category_id?.toString() || '')
        setThumbnailPreview(postData.image || null)
        setCategories(categoriesData)
        setStatuses(statusesData)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load article data')
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [id])

  // 🔹 อัปโหลดรูปภาพ
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setThumbnailPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // 🔹 ฟังก์ชันอัปเดตบทความ
  const handleUpdate = async (status) => {
    setLoading(true)
    setError(null)

    try {
      // ✅ Validation
      if (!title.trim()) throw new Error('Title is required')
      if (!categoryId) throw new Error('Please select a category')
      if (!introduction.trim()) throw new Error('Introduction is required')
      if (!content.trim()) throw new Error('Content is required')

      const statusObj = statuses.find((s) => s.status === status)
      if (!statusObj) throw new Error('Invalid status')

      // ✅ อัปโหลดรูปภาพใหม่ถ้ามี
      let imageUrl = thumbnailPreview
      if (thumbnailFile) {
        try {
          setUploadingImage(true)
          console.log('📤 Uploading image to Supabase...')
          const uploadResult = await uploadImage(thumbnailPreview)
          imageUrl = uploadResult.url
          console.log('✅ Uploaded image URL:', imageUrl)
        } catch (uploadErr) {
          console.error('❌ Upload failed:', uploadErr)
          throw new Error('Failed to upload image: ' + uploadErr.message)
        } finally {
          setUploadingImage(false)
        }
      }

      // ✅ เตรียมข้อมูลอัปเดต
      const updateData = {
        title: title.trim(),
        description: introduction.trim(),
        content: content.trim(),
        category_id: parseInt(categoryId),
        status_id: statusObj.id,
        image: imageUrl,
      }

      // ✅ ส่งไปอัปเดต
      await updatePost(id, updateData)
      console.log('✅ Post updated successfully')

      navigate('/admin/article-management')
    } catch (err) {
      console.error('Error updating post:', err)
      setError(err.message || 'Failed to update article')
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  const handleSaveAsDraft = () => handleUpdate('draft')
  const handleSaveAndPublish = () => handleUpdate('publish')

  if (loadingData) {
    return (
      <div className="min-h-screen ml-[280px] bg-[#F9F8F6] flex items-center justify-center">
        <div className="text-gray-600">Loading article...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ml-[280px] bg-[#F9F8F6]">
      <SideBar />

      {/* Header */}
      <div className="flex justify-between items-center px-15 border-b-1 border-stone-200 h-[96px]">
        <h1 className="text-2xl font-semibold text-gray-800">Edit article</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/article-management')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAsDraft}
            disabled={loading || uploadingImage}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save as draft'}
          </button>
          <button
            onClick={handleSaveAndPublish}
            disabled={loading || uploadingImage}
            className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50"
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

      {/* Uploading Notice */}
      {uploadingImage && (
        <div className="mx-15 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading image to cloud storage...</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="flex-1 p-15 w-full">
        <div className="space-y-6">
          {/* Thumbnail */}
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
                        setThumbnailFile(null)
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
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
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

          {/* Title, Intro, Content */}
          <div className="flex flex-col w-[1040px]">
            <label className="font-poppins font-medium text-[#75716B]">Title *</label>
            <input
              type="text"
              placeholder="Article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 bg-white rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex flex-col w-[1040px]">
            <label className="font-poppins font-medium text-[#75716B]">
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

          <div className="flex flex-col w-[1040px]">
            <label className="font-poppins font-medium text-[#75716B]">Content *</label>
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

export default EditArticle
