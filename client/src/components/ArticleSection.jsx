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

const ArticleSection = () => {
  const {
    blogs,
    text,
    setText,
    category,
    setCategory,
    hasMore,
    isLoading,
    loadMore,
  } = useFetch()

  // ✅ categories list (Highlight + unique category name จาก blogs)
  const categories = [
    { value: 'Highlight', label: 'Highlight' },
    ...Array.from(
      new Set(blogs.map((b) => b.category?.name).filter(Boolean))
    ).map((name) => ({
      value: name,
      label: name,
    })),
  ]

  const handleCategoryChange = (val) => {
    setCategory(val)
  }

  // Filter frontend: search + category
  const filteredBlogs = blogs.filter((b) => {
    const matchText =
      !text ||
      b.title.toLowerCase().includes(text.toLowerCase()) ||
      b.description?.toLowerCase().includes(text.toLowerCase())

    if (!category || category === 'Highlight') {
      return matchText
    }

    return matchText && b.category?.name === category
  })

  return (
    <div className="flex flex-col gap-10 justify-center items-center p-4 md:p-4 w-full">
      {/* Header */}
      <div className="flex flex-row justify-start items-start font-Poppins font-semibold text-2xl text-gray-800 w-[1200px]">
        <h3>Latest articles</h3>
      </div>

      {/* Desktop Filter */}
      <div className="hidden md:flex items-center justify-between w-[1200px] mx-auto p-4 px-16 rounded-lg bg-stone-100 shadow-sm">
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

        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-64 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={text}
            onChange={(e) => setText(e.target.value)}
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
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={text}
          onChange={(e) => setText(e.target.value)}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl h-full  ">
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
      {!isLoading && <BlogCard blogs={filteredBlogs} />}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="hover:text-muted-foreground font-medium underline disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex flex-col items-center  h-screen gap-6 lg:py-100">
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
            ) : (
              'View more'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ArticleSection
