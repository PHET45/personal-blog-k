import { useState, useEffect, useCallback } from 'react'
import { getBlogs, getStatuses, deletePost } from '../services/blogService'

export const useAdminBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [statuses, setStatuses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Status')
  const [categoryFilter, setCategoryFilter] = useState('Category')

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await getBlogs()
      const list = Array.isArray(res) ? res : res?.data || []
      setBlogs(list)
    } catch (err) {
      console.error('Error fetching admin blogs:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch statuses
  const fetchStatuses = useCallback(async () => {
    try {
      const data = await getStatuses()
      setStatuses(Array.isArray(data) ? data : data?.data || [])
    } catch (err) {
      console.error('Failed to fetch statuses', err)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchBlogs()
    fetchStatuses()
  }, [fetchBlogs, fetchStatuses])

  // Normalize articles
  const articles = blogs.map((b) => {
    const statusObj = statuses.find((s) => s.status === b.status?.status)
    let status = statusObj?.status || null
    if (status === 'publish') status = 'Published'

    return {
      id: b.id,
      title: b.title || 'Untitled',
      category: b.category?.name || 'Uncategorized',
      status,
      rawBlog: b,
    }
  })

  // Filters
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'Status' ||
      (article.status &&
        article.status.toLowerCase() === statusFilter.toLowerCase())
    const matchesCategory =
      categoryFilter === 'Category' || article.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const uniqueCategories = [
    ...new Set(blogs.map((b) => b.category?.name || 'Uncategorized')),
  ]

  // ✅ แค่เปิด dialog
  const handleDelete = (id) => {
    setSelectedId(id)
    setShowDeleteDialog(true)
  }

  // ✅ ลบจริงตอนยืนยัน
  const confirmDelete = async () => {
    if (!selectedId) return
    setDeleteLoading(selectedId)
    setError(null)
    try {
      await deletePost(selectedId)
      await fetchBlogs()
    } catch (err) {
      console.error('Failed to delete post:', err)
      setError(err.message || 'Failed to delete article')
    } finally {
      setDeleteLoading(null)
      setShowDeleteDialog(false)
      setSelectedId(null)
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('Status')
    setCategoryFilter('Category')
  }

  return {
    blogs,
    articles,
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
    confirmDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    resetFilters,
    refetch: fetchBlogs,
    setError,
  }
}
