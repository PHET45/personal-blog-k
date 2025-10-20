import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import BlogCard from './BlogCard'
import GooeyNav from './ui/GooeyNav'
import { useFetch } from '@/hooks/useFetch'
import MetaBalls from './ui/MetaBalls'
import SearchAutocomplete from './SearchAutocomplete'
import Pagination from './Pagination'

const ArticleSection = () => {
  const {
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
  } = useFetch()

  const categories = [
    { value: 'Highlight', label: 'Highlight' },
    ...Array.from(
      new Set(allBlogs.map((b) => b.category?.name).filter(Boolean))
    ).map((name) => ({
      value: name,
      label: name,
    })),
  ]

  const handleCategoryChange = (val) => {
    setCategory(val)
    setPage(1)
    fetchBlog({ append: false, selectedCategory: val })
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  // Filter frontend: search + category
  const filteredBlogs = text
    ? allBlogs.filter((b) => {
        const matchText =
          b.title.toLowerCase().includes(text.toLowerCase()) ||
          b.description?.toLowerCase().includes(text.toLowerCase())

        if (!category || category === 'Highlight') return matchText

        return matchText && b.category?.name === category
      })
    : category && category !== 'Highlight'
    ? allBlogs.filter((b) => b.category?.name === category)
    : blogs

  return (
    <div className="flex flex-col gap-10 justify-center items-center p-4 md:p-4 w-full">
      {/* Header */}
      <div className="flex flex-row justify-start items-start font-Poppins font-semibold text-2xl text-gray-800 w-[1200px]">
        <h3>Latest articles</h3>
      </div>

      {/* Desktop Filter */}
      <div className="hidden md:flex items-center justify-between w-full lg:max-w-[1200px] mx-auto p-4 px-16 rounded-lg bg-[#EFEEEB] shadow-sm">
        <div className="flex items-center gap-3 flex-1 max-w-[538px] mr-4">
          <button
            onClick={() => {
              const container = document.getElementById('gooey-nav-container')
              if (container) {
                container.scrollBy({ left: -200, behavior: 'smooth' })
              }
            }}
            className="flex-shrink-0 p-2 hover:bg-white rounded-lg transition-colors"
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            id="gooey-nav-container"
            className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex items-center gap-3">
              <GooeyNav
                items={categories}
                value={category || 'Highlight'}
                onValueChange={handleCategoryChange}
                particleCount={15}
                particleDistances={[90, 10]}
                particleR={100}
                initialActiveIndex={0}
                animationTime={600}
                timeVariance={300}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
              />
            </div>
          </div>

          <button
            onClick={() => {
              const container = document.getElementById('gooey-nav-container')
              if (container) {
                container.scrollBy({ left: 200, behavior: 'smooth' })
              }
            }}
            className="flex-shrink-0 p-2 hover:bg-white rounded-lg transition-colors"
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="relative flex min-w-[360px]">
          <SearchAutocomplete
            blogs={allBlogs}
            value={text}
            className="w-full px-6 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            onChange={setText}
            onSelect={(suggestion) => {
              console.log('Selected:', suggestion)
            }}
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
        </div>
      </div>

      {/* Mobile Filter */}
      <div className="md:hidden flex flex-col gap-4 w-full mx-auto p-4 rounded-lg bg-stone-100 shadow-sm">
        <SearchAutocomplete
          blogs={allBlogs}
          value={text}
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          onChange={setText}
          onSelect={(suggestion) => {
            console.log('Selected:', suggestion)
          }}
        />
        <Select value={category || 'Highlight'} onValueChange={setCategory}>
          <SelectTrigger className="w-full px-4 py-2 rounded-lg focus:ring-2 appearance-none">
            <SelectValue placeholder="Highlight" />
          </SelectTrigger>
          <SelectContent className="bg-stone-100">
            <SelectGroup>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl h-full">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full animate-pulse">
              <div className="h-[212px] sm:h-[360px] w-full rounded-lg bg-gray-200 mb-4" />
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-4/4 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-6/6 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Blog Cards */}
      {!isLoading &&
        (filteredBlogs.length > 0 ? (
          <BlogCard blogs={filteredBlogs} />
        ) : (
          <div className="flex justify-center items-center w-full max-w-6xl h-[600px] text-gray-500 text-lg">
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
        ))}

      {/* Pagination */}
      {!text && (!category || category === 'Highlight') && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

export default ArticleSection