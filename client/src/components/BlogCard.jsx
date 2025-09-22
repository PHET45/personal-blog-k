import { Link } from 'react-router-dom'

function BlogCard({ blogs = [] }) {
  if (!blogs.length) {
    return <p className="text-center text-gray-500">No blogs found.</p>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-items-center p-4 ">
      {blogs.map((post) => (
        <div key={post.id} className="flex flex-col gap-4 w-[582px] ">
          <Link
            to={`/post/${post.id}`}
            className="relative h-[212px] sm:h-[360px] flex items-center justify-center overflow-hidden rounded-md bg-gray-100"
          >
            <img
              className="w-full h-full object-cover rounded-md"
              src={post.image || 'https://via.placeholder.com/400x200'}
              alt={post.title}
              onError={(e) =>
                (e.target.src = 'https://via.placeholder.com/400x200')
              }
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
                {post.category?.name || 'Uncategorized'}
              </span>
            </div>
            <Link to={`/post/${post.id}`}>
              <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
                {post.title}
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
              {post.description}
            </p>
            <div className="flex items-center text-sm">
              <img
                className="w-8 h-8 rounded-full mr-2 object-cover object-center"
                src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
                alt="Author"
              />
              <span>{post.author || 'Unknown'}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogCard
