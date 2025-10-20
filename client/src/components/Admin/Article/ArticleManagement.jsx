import React from 'react'
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react'
import SideBar from '../SideBar.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminBlogs } from '@/hooks/useAdminBlogs.jsx'
import MetaBalls from '@/components/ui/MetaBalls.jsx'

const ArticleManagement = () => {
  const navigate = useNavigate()

  // ✅ ทุกอย่างมาจาก hook แล้ว
  const {
    filteredArticles,
    statuses,
    uniqueCategories,
    isLoading,
    deleteLoading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    handleDelete,
    setError,
    setShowDeleteDialog,
    confirmDelete,
    showDeleteDialog,
  } = useAdminBlogs()

  // Handle Edit
  const handleEdit = (id) => {
    navigate(`/admin/article-management/edit/${id}`)
  }

  return (
    <div className="min-h-screen ml-[280px] max-w-screen mx-auto bg-[#F9F8F6]">
      <SideBar />

      {/* Header */}
      <div className="flex justify-between items-center px-15 border-b border-stone-200 h-[96px]">
        <h1 className="text-2xl font-semibold text-gray-800">
          Article management
        </h1>
        <button className="lg:w-[221px] lg:h-[48px] bg-gray-800 hover:bg-gray-900 text-white px-4  rounded-4xl flex justify-center  items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          <Link to="/admin/article-management/create-article">
            Create article
          </Link>
        </button>
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

      {/* Main Content */}
      <div className="flex-1 p-15 w-full">
        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[360px] h-[48px] pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-32 h-[48px] w-[200px]"
          >
            <option value="Status">Status</option>
            {statuses.map((s) => {
              let label = s.status
              if (label === 'publish') label = 'Published'
              return (
                <option key={s.id || label} value={label}>
                  {label}
                </option>
              )
            })}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-32 h-[48px] w-[200px]"
          >
            <option value="Category">Category</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Articles Table */}
        {!isLoading && (
          <div className="bg-[#F9F8F6] rounded-lg shadow-sm border-1 border-[#DAD6D1]">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div className="col-span-6">Article title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Actions</div>
            </div>

            {filteredArticles.map((article, index) => (
              <div
                key={article.id}
                className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-100 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.1)]
          ${index % 2 === 0 ? 'bg-[#F9F8F6]' : 'bg-[#EFEEEB]'}`}
              >
                <div className="col-span-6">
                  <div className="text-sm text-gray-900 font-medium">
                    {article.title}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-sm text-gray-600">
                    {article.category}
                  </div>
                </div>

                <div className="col-span-2">
                  {/* Status with color */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${
                article.status === 'Published'
                  ? 'bg-green-100 text-green-800'
                  : article.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : article.status === 'archived'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-1.5
                ${
                  article.status === 'Published'
                    ? 'bg-green-500'
                    : article.status === 'draft'
                    ? 'bg-yellow-500'
                    : article.status === 'archived'
                    ? 'bg-gray-500'
                    : 'bg-gray-300'
                }`}
                    ></div>
                    {article.status || 'Unknown'}
                  </span>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(article.id)}
                      className="p-1.5 cursor-pointer text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit article"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={deleteLoading === article.id}
                      className="p-1.5 text-gray-400 cursor-pointer hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete article"
                    >
                      {deleteLoading === article.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                    Delete article
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Do you want to delete this article?
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {filteredArticles.length === 0 && (
              <div className="flex flex-col items-center h-screen gap-6 lg:py-100">
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleManagement
