// src/hooks/useFetch.jsx
import { useState, useEffect, useCallback, useContext } from 'react'
import { getBlogs } from '../services/blogService'
import { AuthContext } from '@/context/AuthContextObject'

export const useFetch = () => {
  const { user } = useContext(AuthContext) // track login/logout
  const [blogs, setBlogs] = useState([])
  const [allBlogs, setAllBlogs] = useState([]) // 🆕 เพิ่มนี้ - สำหรับ autocomplete
  const [text, setText] = useState('')
  const [category, setCategory] = useState('Highlight')
  const [page, setPage] = useState(1)
  const limit = 6
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // 🆕 เพิ่ม function นี้ - ดึงข้อมูลทั้งหมดสำหรับ autocomplete
  const fetchAllBlogs = useCallback(async () => {
    try {
      const params = { limit: 1000 } // ดึงมาเยอะๆ สำหรับ search
      const res = await getBlogs(params)
      const list = Array.isArray(res)
        ? res
        : res?.data || res?.blogs || []
      setAllBlogs(list)
    } catch (err) {
      console.error('Error fetching all blogs:', err)
    }
  }, [])

  const fetchBlog = useCallback(
    async ({ append = false } = {}) => {
      try {
        setIsLoading(true)

        const params = { page, limit }
        if (category && category !== 'Highlight') params.category = category

        const res = await getBlogs(params)

        // ✅ รองรับ backend ที่ return data ไม่ตรง
        const list = Array.isArray(res)
          ? res
          : res?.data || res?.blogs || []

        setBlogs(prev => (append ? [...prev, ...list] : list))
        setHasMore(list.length === limit)
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    },
    [category, page]
  )

  // 🆕 เพิ่ม useEffect นี้ - โหลดข้อมูลทั้งหมดครั้งแรก
  useEffect(() => {
    fetchAllBlogs()
  }, [fetchAllBlogs])

  // รีเฟรชตอน login/logout หรือ category change
  useEffect(() => {
    setPage(1)
    fetchBlog({ append: false })
  }, [category, user, fetchBlog])

  // โหลดเพิ่มตอนเปลี่ยนหน้า
  useEffect(() => {
    if (page > 1) fetchBlog({ append: true })
  }, [page, fetchBlog])

  const loadMore = () => {
    if (!isLoading && hasMore) setPage(prev => prev + 1)
  }

  return {
    blogs,
    allBlogs, // 🆕 เพิ่มนี้ - return allBlogs ออกไป
    text,
    setText,
    category,
    setCategory,
    isLoading,
    hasMore,
    loadMore,
  }
}