// components/Admin/CategoryManagement/CategoryManagement.jsx
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import SideBar from '../SideBar.jsx'
import MetaBalls from '@/components/ui/MetaBalls.jsx'
import { getCategories, deleteCategory } from '@/services/categoriesService.js'

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false) 

  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const navigate = useNavigate()

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // ✅ เปิด dialog
  const handleDeleteClick = (category) => {
    setSelectedCategory(category)
    setShowDeleteDialog(true)
  }

  // ✅ ยืนยันการลบ
  const confirmDelete = async () => {
    if (!selectedCategory) return
    setDeleting(true)
    try {
      await deleteCategory(selectedCategory.id)
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== selectedCategory.id)
      )
      setShowDeleteDialog(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error('Error deleting category:', error)
    } finally {
      setDeleting(false)
    }
  }

  // ✅ filter
  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen ml-[280px] bg-[#F9F8F6]">
      <SideBar />

      {/* Header */}
      <div className="flex justify-between items-center px-15 border-b border-stone-200 h-[96px]">
        <h1 className="text-2xl font-semibold text-gray-800">
          Category Management
        </h1>
        <Link
          to="/admin/category-management/create-category"
          className="lg:h-[48px] bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-4xl flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create category
        </Link>
      </div>

      {/* Main Content */}
      <div className="p-15">
        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[360px] h-[48px] pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow border border-[#DAD6D1] overflow-hidden">
          <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-200 text-sm font-medium text-gray-600 bg-[#F9F8F6]">
            <div className="col-span-6">Category</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <MetaBalls
                color="oklch(89.7% 0.196 126.665)"
                cursorBallColor="oklch(89.7% 0.196 126.665)"
                cursorBallSize={4}
                ballCount={30}
                animationSize={60}
                enableMouseInteraction={true}
                enableTransparency={true}
                hoverSmoothness={0.05}
                clumpFactor={2}
                speed={0.3}
              />
            </div>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((cat, index) => (
              <div
                key={cat.id}
                className={`grid grid-cols-8 gap-4 p-4 transition-colors ${
                  index % 2 === 0 ? 'bg-[#F9F8F6]' : 'bg-[#EFEEEB]'
                }`}
              >
                <div className="col-span-6 text-gray-900 font-medium">
                  {cat.name}
                </div>
                <div className="col-span-2 flex justify-center space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/category-management/edit/${cat.id}`)
                    }
                    className="p-1.5 cursor-pointer text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cat)}
                    className="p-1.5 text-gray-400 cursor-pointer hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 text-lg">
              No categories found.
            </div>
          )}
        </div>
      </div>

      {/* ✅ Delete Dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Delete category
            </h2>
            <p className="text-gray-600 mb-8">
              Do you want to delete “{selectedCategory?.name}”?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  deleting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManagement
