// src/components/SearchAutocomplete.jsx
import React, { useState, useRef, useEffect } from 'react'

const SearchAutocomplete = ({ blogs, value, onChange, onSelect }) => {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const wrapperRef = useRef(null)

  // Get suggestions based on search text
  const getSuggestions = () => {
    if (!value || value.trim().length < 2) return []

    const searchTerm = value.toLowerCase()
    const suggestions = []

    // ค้นหาจาก title และ description
    blogs.forEach((blog) => {
      const titleMatch = blog.title?.toLowerCase().includes(searchTerm)
      const descMatch = blog.description?.toLowerCase().includes(searchTerm)
      const categoryMatch = blog.category?.name?.toLowerCase().includes(searchTerm)

      if (titleMatch || descMatch || categoryMatch) {
        suggestions.push({
          id: blog.id,
          type: titleMatch ? 'title' : descMatch ? 'description' : 'category',
          text: blog.title,
          category: blog.category?.name,
          description: blog.description,
        })
      }
    })

    // Remove duplicates and limit to 8 results
    return suggestions.slice(0, 8)
  }

  const suggestions = getSuggestions()

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0) {
        handleSelectSuggestion(suggestions[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.text)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    if (onSelect) {
      onSelect(suggestion)
    }
  }

  const handleInputChange = (e) => {
    onChange(e.target.value)
    setShowSuggestions(true)
    setHighlightedIndex(-1)
  }

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-semibold text-blue-600">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        placeholder="Search"
        autoComplete="off"
        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value.length >= 2 && setShowSuggestions(true)}
      />

      {/* Search Icon */}
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.id}-${index}`}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                index === highlightedIndex
                  ? 'bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <svg
                  className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {highlightMatch(suggestion.text, value)}
                  </div>
                  {suggestion.category && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      in {suggestion.category}
                    </div>
                  )}
                  {suggestion.description && (
                    <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {suggestion.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Results count */}
          <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t">
            {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} found
          </div>
        </div>
      )}

      {/* No results */}
      {showSuggestions && value.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500 text-sm">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            No results found for "{value}"
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchAutocomplete