import { useState, useEffect, useCallback } from 'react'
import { getBlogs } from '../services/blogService'

export const useFetch = () => {
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [category, setCategory] = useState('Highlight') // เริ่มต้นด้วย Highlight
  const [page, setPage] = useState(1)
  const [limit] = useState(4)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // 📌 ดึงข้อมูลจาก backend โดยส่ง category + pagination
  const fetchBlog = useCallback(
    async (query, { append = false } = {}) => {
      try {
        setIsLoading(true)
        const params = query || {}

        // ✅ ถ้าเลือก Highlight จะไม่ส่ง category ไป (ให้ได้ทั้งหมด)
        if (category && category !== 'Highlight') {
          params.category = category
        }

        params.page = params.page ?? 1
        params.limit = params.limit ?? limit

        const items = await getBlogs(params)
        console.log('Fetched blogs:', items) // Debug

        setBlogs((prev) => (append ? [...prev, ...items] : items))
        setHasMore(Array.isArray(items) ? items.length === limit : false)
      } catch (err) {
        console.error('Error fetching blog:', err)
        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    },
    [category, limit]
  )

  // 📌 ดึงข้อมูลใหม่เมื่อ category เปลี่ยน
  useEffect(() => {
    setPage(1)
    setHasMore(true)
    fetchBlog({ page: 1 })
  }, [category, fetchBlog])

  // 📌 ดึงข้อมูลเพิ่มเมื่อ page เปลี่ยน
  useEffect(() => {
    if (page === 1) return
    fetchBlog({ page }, { append: true })
  }, [page, fetchBlog])

  // 📌 Filter frontend (เฉพาะ text + tags)
  useEffect(() => {
    let result = [...blogs]

    if (text) {
      result = result.filter((b) =>
        b.title.toLowerCase().includes(text.toLowerCase())
      )
    }

    if (selectedTags.length > 0) {
      result = result.filter((b) =>
        selectedTags.every((tag) => b.tags?.includes(tag))
      )
    }

    setFilteredBlogs(result)
  }, [text, selectedTags, blogs])

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const loadMore = () => {
    if (isLoading || !hasMore) return
    setPage((prevPage) => prevPage + 1)
  }

  return {
    blogs: filteredBlogs, // ✅ blogs ที่ถูก filter แล้ว
    text,
    setText,
    selectedTags,
    handleTagClick,
    category,
    setCategory,
    page,
    limit,
    isLoading,
    hasMore,
    loadMore,
  }
}

export default useFetch
