import { useState, useEffect, useMemo, useCallback } from 'react'
import debounce from 'lodash.debounce'
import { getBlogs } from '../services/blogService'

export const useFetch = () => {
  const [blogs, setBlogs] = useState([])
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(4) // เริ่มต้นแสดง 4 รายการต่อหน้า
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchBlog = useCallback(
    async (query, { append = false } = {}) => {
      try {
        setIsLoading(true)
        const params =
          typeof query === 'string' ? { keyword: query } : query || {}

        // ใช้ category parameter เฉพาะเมื่อไม่ใช่ Highlight
        const effectiveCategory = category === 'Highlight' ? '' : category
        if (effectiveCategory) params.category = effectiveCategory

        if (text && params.keyword == null) params.keyword = text
        params.page = params.page ?? 1
        params.limit = params.limit ?? limit

        const data = await getBlogs(params)
        const items = data?.data ?? data

        setBlogs((prev) => (append ? [...prev, ...items] : items))
        setHasMore(Array.isArray(items) ? items.length === limit : false)
      } catch (err) {
        console.error('Error fetching blog:', err)
        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    },
    [category, text, limit]
  )

  const debouncedFetch = useMemo(
    () => debounce((q) => fetchBlog({ keyword: q, page: 1 }), 400),
    [fetchBlog]
  )

  // Function to setup DOM observer for category changes
  const setupCategoryObserver = () => {
    const el = document.querySelector('.effect.text')
    if (!el) return null

    const updateFromDom = () => {
      const label = el.textContent?.trim()
      if (label) setCategory(label)
    }

    const observer = new MutationObserver(updateFromDom)
    observer.observe(el, {
      characterData: true,
      childList: true,
      subtree: true,
    })

    updateFromDom()
    return observer
  }

  // Effect for handling search and fetch
  useEffect(() => {
    // รีเซ็ตหน้าและข้อมูลเมื่อมีการเปลี่ยนแปลงการค้นหาหรือหมวดหมู่
    setPage(1)
    setHasMore(true)
    setBlogs([])
    if (text) {
      debouncedFetch(text)
    } else {
      fetchBlog({ page: 1 })
    }
    return () => debouncedFetch.cancel()
  }, [text, category, debouncedFetch, fetchBlog])

  // Effect for observing GooeyNav active label changes
  useEffect(() => {
    const observer = setupCategoryObserver()
    return () => observer?.disconnect()
  }, [])

  // ดึงข้อมูลเมื่อ page เปลี่ยน (เช่นกด View more)
  useEffect(() => {
    if (page === 1) return // หน้าหลักจัดการโดย effect อื่นแล้ว
    console.log('Page effect triggered:', page)
    fetchBlog({ page }, { append: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleTagClick = (tag) => {
    setSelectedTags((prev) => {
      let newTags
      if (prev.includes(tag)) {
        newTags = prev.filter((t) => t !== tag)
      } else {
        newTags = [...prev, tag]
      }
      setText(newTags.join(' '))
      return newTags
    })
  }

  const loadMore = () => {
    if (isLoading || !hasMore) return
    // Debug: track clicks
    console.log('View more clicked. Go to page:', page + 1)
    setPage((prevPage) => prevPage + 1)
  }

  return {
    blogs,
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
