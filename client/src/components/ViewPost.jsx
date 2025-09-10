import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlogById } from '@/services/blogService'
import ReactMarkdown from 'react-markdown'
import FuzzyText from './ui/FuzzyText'
import PillNav from './ui/PillNav'
import { CiFaceSmile } from 'react-icons/ci'
import { IoCopyOutline } from 'react-icons/io5'
import { FaFacebook } from 'react-icons/fa'
import { CiTwitter } from 'react-icons/ci'
import { SlSocialLinkedin } from 'react-icons/sl'
export const ViewPost = () => {
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
    <div className="max-w-[1200px] mx-auto p-4 items-center markdown">
      {loading && <div>Loading...</div>}
      {!loading && !post && (
        <div className="flex flex-col items-center gap-6 py-8">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover={true}
            color="#111111"
            fontSize="clamp(3rem, 12vw, 8rem)"
          >
            404 not found
          </FuzzyText>
          <br />
          <Link to="/">
            <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none  focus:ring-gray-300 font-medium rounded-full text-sm me-2 mb-2 dark:bg-gray-800 dark:hover:bg-[hsla(36,4%,44%,1)] dark:focus:ring-gray-700 dark:border-stone-400 px-[40px] py-[12px] border-1 ">
              Go to Homepage
            </button>
          </Link>
        </div>
      )}
      <div>
        {!loading && post && (
          <article className="max-w-auto">
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded-lg mb-6  object-cover object-center"
              />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-2 ">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      {post.category && (
                        <span className="inline-flex items-center rounded-full bg-green-200 text-green-700 px-3 py-1 text-xs font-semibold">
                          {post.category}
                        </span>
                      )}
                      {post.date && (
                        <span className="text-xs text-gray-500">
                          {post.date}
                        </span>
                      )}
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                      {post.title}
                    </h1>

                    <p className="text-sm text-gray-600 mb-6">
                      {post.description}
                    </p>

                    {post.content && (
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    )}
                    {/* laptop */}
                    <div className="w-full rounded-3xl bg-stone-100 p-4 flex flex-row justify-between items-center shadow-sm mt-4">
                      <div>
                        <PillNav
                          items={[
                            {
                              label: (
                                <div className="flex items-center">
                                  <CiFaceSmile />
                                  <span style={{ marginLeft: 4 }}>32</span>
                                </div>
                              ),
                              href: '',
                            },
                          ]}
                          activeHref="/"
                          className="custom-nav"
                          ease="power2.easeOut"
                          baseColor="#f4f3f0"
                          pillColor="#fff"
                          hoveredPillTextColor="#222"
                          pillTextColor="#222"
                        />
                      </div>
                      <div className="flex flex-row gap-2">
                        <PillNav
                          items={[
                            {
                              label: (
                                <div className="flex items-center">
                                  <IoCopyOutline />
                                  <span style={{ marginLeft: 4 }}>
                                    Copy link
                                  </span>
                                </div>
                              ),
                              href: '',
                            },
                            { label: <FaFacebook />, href: '' },
                            { label: <SlSocialLinkedin />, href: '' },
                            { label: <CiTwitter />, href: '' },
                          ]}
                          activeHref="/"
                          className="custom-nav"
                          ease="power2.easeOut"
                          baseColor="#f4f3f0"
                          pillColor="#fff"
                          hoveredPillTextColor="#222"
                          pillTextColor="#222"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 rounded-2xl bg-stone-100 p-5 shadow-sm border border-gray-200 w-full lg:w-80 lg:sticky top-5 self-start">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="">
                        <img
                          src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
                          alt="Author avatar"
                          className="w-1/2 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="w-1/2">
                        <div className="text-xs text-gray-500 leading-none mb-1">
                          Author
                        </div>
                        <div className="text-lg font-extrabold text-gray-900 leading-none">
                          {post.author}
                        </div>
                      </div>
                    </div>
                    <hr className="border-t-2 border-gray-200 mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      I am a pet enthusiast and freelance writer who specializes
                      in animal behavior and care. With a deep love for cats, I
                      enjoy sharing insights on feline companionship and
                      wellness.
                    </p>
                    <p className="text-sm text-gray-600">
                      When I'm not writing, I spend time volunteering at my
                      local animal shelter, helping cats find loving homes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
