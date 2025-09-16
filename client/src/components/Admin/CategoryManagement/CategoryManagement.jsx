import React from 'react'
import { useState } from 'react'
import { Search, Plus, Edit2, Trash2 } from 'lucide-react'
import SideBar from '../SideBar.jsx'
import { Link } from 'react-router-dom'

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Category')

  const articles = [
    {
      id: 1,
      category: 'Cat',
    },
    {
      id: 2,
      category: 'Cat',
    },
    {
      id: 3,
      category: 'General',
    },
    {
      id: 4,
      category: 'Cat',
    },
    {
      id: 5,
      category: 'Cat',
    },
    {
      id: 6,
      category: 'Inspiration',
    },
  ]

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.category
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === 'Category' || article.category === categoryFilter
    return matchesSearch  && matchesCategory
  })
  return (
    <div className="min-h-screen  ml-[280px] max-w-screen mx-auto bg-gray-50">
      <SideBar />

      {/* Header */}

      <div className="flex justify-between items-center px-15 border-b-1 border-stone-200 h-[96px]">
        <h1 className="text-2xl font-semibold text-gray-800">
          Article management
        </h1>
        <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-4xl flex items-center transition-colors ">
          <Plus className="w-4 h-4 mr-2" />
          <Link to="/admin/create-article">Create article</Link>
        </button>
      </div>

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

         

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-32 h-[48px] w-[200px]"
          >
            <option>Category</option>
            <option>Cat</option>
            <option>General</option>
            <option>Inspiration</option>
          </select>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow-sm ">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="col-span-6">Category</div>
          </div>

          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="grid grid-cols-8 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-6">
                <div className="text-sm text-gray-900 font-medium">
                  {article.category}
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No articles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryManagement
