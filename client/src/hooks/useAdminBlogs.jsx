// src/hooks/useAdminBlogs.jsx
import { useState, useEffect, useCallback } from 'react'
import { getBlogs, getStatuses, deletePost } from '../services/blogService'

export const useAdminBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [statuses, setStatuses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)

  // Filter states
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

  // Initial fetch
  useEffect(() => {
    fetchBlogs()
    fetchStatuses()
  }, [fetchBlogs, fetchStatuses])

  // Map articles with status normalization
  const articles = blogs.map((b) => {
    const statusObj = statuses.find((s) => s.status === b.status?.status)
    let status = statusObj?.status || null

    // แปลง publish → Published
    if (status === 'publish') status = 'Published'

    return {
      id: b.id,
      title: b.title || 'Untitled',
      category: b.category?.name || 'Uncategorized',
      status,
      rawBlog: b, // เก็บ raw data ไว้ถ้าต้องการใช้
    }
  })

  // Filter articles
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

  // Get unique categories
  const uniqueCategories = [
    ...new Set(blogs.map((b) => b.category?.name || 'Uncategorized')),
  ]

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return false
    }

    setDeleteLoading(id)
    setError(null)

    try {
      await deletePost(id)
      await fetchBlogs() // Refresh list
      return true
    } catch (err) {
      console.error('Failed to delete post:', err)
      setError(err.message || 'Failed to delete article')
      return false
    } finally {
      setDeleteLoading(null)
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('Status')
    setCategoryFilter('Category')
  }

  return {
    // Data
    blogs,
    articles,
    filteredArticles,
    statuses,
    uniqueCategories,

    // Loading states
    isLoading,
    deleteLoading,
    error,

    // Filter states
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,

    // Actions
    handleDelete,
    resetFilters,
    refetch: fetchBlogs,
    setError,
  }
}