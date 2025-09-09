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
import { blogPosts } from '../data/blogPost'
import { useFetch } from '@/hooks/useFetch'

const ArticleSection = () => {
  const { blogs, text, setText, category, setCategory } = useFetch()
  const categories = [
    { value: 'Highlight', label: 'Highlight' },
    { value: 'Cat', label: 'Cat' },
    { value: 'Inspiration', label: 'Inspiration' },
    { value: 'General', label: 'General' },
  ]

  const filteredBlogs = blogs.length ? blogs : blogPosts

  return (
    <div className="flex flex-col gap-6 items-center p-4 md:p-4">
      <div className="font-Poppins font-semibold text-2xl leading-8 text-gray-800 self-start">
        <h3>Latest articles</h3>
      </div>
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between w-full mx-auto p-4 px-16 rounded-lg bg-stone-100 shadow-sm">
        <div className="flex items-center gap-3">
          <GooeyNav
            items={categories}
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

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col gap-4 w-full mx-auto p-4 rounded-lg bg-stone-100 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        <div className="flex flex-col space-y-2 ">
          <label className="text-gray-600 text-sm font-medium font-Poppins ">
            Category
          </label>
          <div className="relative">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full px-4 py-2  rounded-lg focus:ring-2   appearance-none ">
                <SelectValue placeholder="Highlight" />
              </SelectTrigger>
              <SelectContent className="bg-stone-100 ">
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
        </div>
      </div>
      <BlogCard blogs={filteredBlogs} />
    </div>
  )
}

export default ArticleSection
