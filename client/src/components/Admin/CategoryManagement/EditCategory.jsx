import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SideBar from '../SideBar'
import { getCategoryById, updateCategory } from '@/services/categoriesService.js'
import { toast } from 'react-toast'

const EditCategory = () => {
  const { id } = useParams() // ดึง id จาก URL
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // ดึงข้อมูล category เดิม
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(id)
        setName(data.name)
      } catch (error) {
        console.error('Error fetching category:', error)
        toast.error('Failed to load category data.')
      }
    }
    fetchCategory()
  }, [id])

  // บันทึกการแก้ไข
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a category name.')
      return
    }
    try {
      setLoading(true)
      await updateCategory(id, name.trim())
      toast.success('Category updated successfully!')
      setTimeout(() => navigate('/admin/category-management'), 1200)
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error(error.message || 'Failed to update category.')
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
          Edit Category
        </h1>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="lg:w-[120px] lg:h-[48px] px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-15 w-full">
        <div className="flex flex-col lg:max-w-[480px]">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Category name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="lg:h-[48px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-800 text-base bg-white shadow-sm"
          />
        </div>
      </div>
    </div>
  )
}

export default EditCategory
