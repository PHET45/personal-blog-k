import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from '../SideBar'
import { createCategory } from '@/services/categoriesService.js'
import { toast } from 'react-toast' 


const CreateCategory = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // ✅ ฟังก์ชันบันทึก category
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a category name.')
      return
    }
    try {
      setLoading(true)
      await createCategory(name.trim())
      toast.success(
        <div>
          <p className="font-semibold text-lg">Create category</p>
          <p className="text-sm text-white/90">
            Category has been successfully created.
          </p>
        </div>
      )
      setTimeout(() => navigate('/admin/category-management'), 1200)
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error(error.message || 'Failed to create category.')
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
          Create Category
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

export default CreateCategory
