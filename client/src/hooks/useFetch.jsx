import { useState, useEffect, useCallback } from 'react'
import { getBlogs } from '../services/blogService'

export const useFetch = () => {
  const [blogs, setBlogs] = useState([]) // raw data
  const [filteredBlogs, setFilteredBlogs] = useState([]) // filtered data
  const [text, setText] = useState('') // search input
  const [selectedTags, setSelectedTags] = useState([])
  const [category, setCategory] = useState('Highlight')
  const [page, setPage] = useState(1)
  const limit = 6
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // ฟังก์ชันดึงข้อมูล blogs จาก backend
  const fetchBlog = useCallback(
    async ({ append = false } = {}) => {
      try {
        setIsLoading(true)

        const params = {
          page,
          limit,
        }

        if (category && category !== 'Highlight') {
          params.category = category
        }

        const items = await getBlogs(params)
        const list = Array.isArray(items) ? items : []
        setBlogs((prev) => (append ? [...prev, ...list] : list))
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

  // ดึงข้อมูลเมื่อ category เปลี่ยน
  useEffect(() => {
    setPage(1)
    fetchBlog()
  }, [category, fetchBlog])

  // ดึงข้อมูลเพิ่มเมื่อ page เปลี่ยน
  useEffect(() => {
    if (page === 1) return
    fetchBlog({ append: true })
  }, [page, fetchBlog])

  // Filter frontend: text + selectedTags
  useEffect(() => {
    let result = blogs

    if (text) {
      const lowerText = text.toLowerCase()
      result = result.filter((b) => b.title.toLowerCase().includes(lowerText))
    }

    if (selectedTags.length > 0) {
      result = result.filter((b) =>
        selectedTags.every((tag) => b.tags?.includes(tag))
      )
    }

    setFilteredBlogs(result)
  }, [blogs, text, selectedTags])

  const handleTagClick = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )

  const loadMore = () => {
    if (!isLoading && hasMore) setPage((prev) => prev + 1)
  }

  return {
    blogs: filteredBlogs,
    text,
    setText,
    selectedTags,
    handleTagClick,
    category,
    setCategory,
    isLoading,
    hasMore,
    loadMore,
  }
}

export default useFetch
