import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { NavFooter } from '@/components/mainLayout/NavFooter'
import { getBlogById } from '@/services/blogService'

export const ViewPostPage = () => {
  const { postid } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const data = await getBlogById(postid)
        setPost(data)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [postid])

  return (
    <NavFooter>
      <div className="max-w-3xl mx-auto p-4">
        {loading && <div>Loading...</div>}
        {!loading && !post && <div>Post not found</div>}
        {!loading && post && (
          <article className="prose max-w-none">
            <h1 className="mb-2">{post.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
              {post.author} • {post.date} • {post.category}
            </div>
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded mb-6"
              />
            )}
            <p className="mb-4">{post.description}</p>
            {post.content && <div>{post.content}</div>}
          </article>
        )}
      </div>
    </NavFooter>
  )
}
