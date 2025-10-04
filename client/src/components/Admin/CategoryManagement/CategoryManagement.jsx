import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2 } from 'lucide-react'
import SideBar from '../SideBar.jsx'
import { Link } from 'react-router-dom'
import { getCategories } from '@/services/categoriesService.js'
import MetaBalls from '@/components/ui/MetaBalls.jsx'
const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Category')
  const [articles, setArticles] = useState([]) // เดิม mock ไว้ ตอนนี้ใช้ state แทน
  const [loading, setLoading] = useState(true)

  // ดึงข้อมูล categories ตอน mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setArticles(data) // เก็บลง state
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])
  console.log(articles)

  // filter
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === 'Category' || article.name === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen ml-[280px] max-w-screen mx-auto bg-[#F9F8F6]">
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
            <option value="Category">Category</option>
            {articles.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Articles Table */}
        <div className="bg-[#F9F8F6] rounded-lg shadow-sm border-1 border-[#DAD6D1] ">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="col-span-6">Category</div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center  h-screen gap-6 lg:py-100">
              <MetaBalls
                color="oklch(89.7% 0.196 126.665)"
                cursorBallColor="oklch(89.7% 0.196 126.665)"
                cursorBallSize={5}
                ballCount={30}
                animationSize={30}
                enableMouseInteraction={true}
                enableTransparency={true}
                hoverSmoothness={0.05}
                clumpFactor={2}
                speed={0.3}
              />
            </div>
          ) : (
            filteredArticles.map((article, index) => (
              <div
                key={article.id}
                className={`grid grid-cols-8 gap-4 p-4 border-b border-gray-100 transition-colors
        ${index % 2 === 0 ? 'bg-[#F9F8F6]' : 'bg-[#EFEEEB]'}
      `}
              >
                <div className="col-span-6">
                  <div className="text-sm text-gray-900 font-medium">
                    {article.name}
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
            ))
          )}
        </div>

        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No articles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryManagement
