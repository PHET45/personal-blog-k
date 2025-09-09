import { useState, useEffect, useMemo } from 'react'
import debounce from 'lodash.debounce'
import { getBlogs } from '../services/blogService'

export const useFetch = () => {
  const [blogs, setBlogs] = useState([])
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [category, setCategory] = useState('')

  const fetchBlog = async (query) => {
    try {
      const params =
        typeof query === 'string' ? { keyword: query } : query || {}
      if (category) params.category = category
      const data = await getBlogs(params)
      setBlogs(data?.data ?? data) // รองรับทั้ง {data:[]} หรือ []
    } catch (err) {
      console.error('Error fetching blog:', err)
    }
  }

  const debouncedFetch = useMemo(() => debounce((q) => fetchBlog(q), 400), [])

  // Function to handle search and fetch logic
  const handleSearchAndFetch = () => {
    if (text) {
      debouncedFetch(text)
    } else {
      fetchBlog('')
    }
  }

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
    handleSearchAndFetch()
    return () => debouncedFetch.cancel()
  }, [text, category, debouncedFetch])

  // Effect for observing GooeyNav active label changes
  useEffect(() => {
    const observer = setupCategoryObserver()
    return () => observer?.disconnect()
  }, [])

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

  return {
    blogs,
    text,
    setText,
    selectedTags,
    handleTagClick,
    category,
    setCategory,
  }
}
