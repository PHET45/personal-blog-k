function BlogCard({ blogs = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-items-center ">
      {blogs.map((post) => (
        <div key={post.id} className="flex flex-col gap-4 w-full max-w-md">
          <a
            href="#"
            className="relative h-[212px] sm:h-[360px] flex items-center justify-center overflow-hidden rounded-md bg-gray-100"
          >
            <img
              className="w-full h-full object-cover rounded-md"
              src={post.image}
              alt={post.title}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm"
              style={{ display: 'none' }}
            >
              Image not available
            </div>
          </a>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
                {post.category}
              </span>
            </div>
            <a href="#">
              <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
                {post.title}
              </h2>
            </a>
            <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
              {post.description}
            </p>
            <div className="flex items-center text-sm">
              <img
                className="w-8 h-8 rounded-full mr-2"
                src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
                alt="Tomson P."
              />
              <span>{post.author}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogCard
