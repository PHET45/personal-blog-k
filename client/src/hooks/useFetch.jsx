// src/hooks/useFetch.jsx
import { useState, useEffect, useCallback, useContext, useRef } from 'react'
import { getPublishedPosts } from '../services/blogService'
import { AuthContext } from '@/context/AuthContextObject'

export const useFetch = () => {
  const { user } = useContext(AuthContext)
  const [blogs, setBlogs] = useState([])
  const [allBlogs, setAllBlogs] = useState([])
  const [text, setText] = useState('')
  const [category, setCategory] = useState('Highlight')
  const [page, setPage] = useState(1)
  const limit = 6
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  
  // ใช้ ref เพื่อป้องกัน infinite loop
  const isFetchingRef = useRef(false)

  // ดึงข้อมูลทั้งหมดสำหรับ autocomplete และ category filter
  const fetchAllBlogs = useCallback(async () => {
    try {
      const params = { limit: 1000 }
      const res = await getPublishedPosts(params)
      const list = Array.isArray(res) ? res : res?.data || res?.blogs || []
      setAllBlogs(list)
    } catch (err) {
      console.error('Error fetching all blogs:', err)
    }
  }, [])

  const fetchBlog = useCallback(
    async ({ append = false, selectedCategory, selectedPage } = {}) => {
      // ป้องกันการเรียกซ้ำ
      if (isFetchingRef.current) return
      
      try {
        isFetchingRef.current = true
        setIsLoading(true)
        
        const currentPage = selectedPage ?? page
        const params = { page: currentPage, limit }

        const cat = selectedCategory ?? category
        if (cat && cat !== 'Highlight') params.category = cat

        const res = await getPublishedPosts(params)
        const list = Array.isArray(res) ? res : res?.data || res?.blogs || []
        const pagination = res?.pagination || {}

        setBlogs(prev => (append ? [...prev, ...list] : list))
        setTotalPages(pagination.totalPages || 1)
      } catch (err) {
        console.error('Error fetching blogs:', err)
      } finally {
        setIsLoading(false)
        isFetchingRef.current = false
      }
    },
    [category, page, limit]
  )

  // โหลดข้อมูลทั้งหมดครั้งแรก
  useEffect(() => {
    fetchAllBlogs()
  }, [fetchAllBlogs])

  // รีเฟรชเมื่อ category หรือ user เปลี่ยน
  useEffect(() => {
    setPage(1)
    fetchBlog({ append: false, selectedPage: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, user])

  // โหลดข้อมูลเมื่อเปลี่ยนหน้า
  useEffect(() => {
    fetchBlog({ append: false, selectedPage: page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return {
    blogs,
    allBlogs,
    text,
    setText,
    category,
    setCategory,
    isLoading,
    setPage,
    fetchBlog,
    page,
    totalPages,
  }
}