import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlogById, toggleLike, getLikes } from '@/services/blogService'
import { AuthService } from '@/services/auth'
import ReactMarkdown from 'react-markdown'
import FuzzyText from './ui/FuzzyText'
import PillNav from './ui/PillNav'
import { CiFaceSmile } from 'react-icons/ci'
import { IoCopyOutline } from 'react-icons/io5'
import { FaFacebook } from 'react-icons/fa'
import { CiTwitter } from 'react-icons/ci'
import { SlSocialLinkedin } from 'react-icons/sl'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { X } from 'lucide-react'

export const ViewPost = () => {
  const { postid } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState(null)
  
  // ✅ ฟังก์ชันดึง token จาก localStorage
  const getToken = () => {
    return localStorage.getItem('token')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // โหลดโพสต์
        const data = await getBlogById(postid)
        setPost(data)
        
        // โหลด user profile
        try {
          const profile = await AuthService.getProfile()
          setUser(profile.user)
        } catch {
          setUser(null)
        }

        // ✅ โหลดข้อมูล likes
        const token = getToken()
        try {
          const likes = await getLikes(postid, token)
          setLikeCount(likes.likes_count)
          setIsLiked(likes.liked || false)
        } catch (err) {
          console.error('Error fetching likes:', err)
        }
      } finally {
        setLoading(false)
      }
    }
  
    fetchData()
    // จัดการ overflow ถ้ามี dialog เปิด
    const originalOverflow = document.body.style.overflow
    if (showDialog) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [postid, showDialog])

  // ✅ Like handler ที่เชื่อมกับ API
  const handleLikeClick = async () => {
    const token = getToken()
  
    if (!token) {
      setShowDialog(true)
      return
    }
  
    // เก็บค่าก่อนหน้าไว้ rollback ได้
    const prevLiked = isLiked
    const prevCount = likeCount
  
    // ✅ อัปเดต UI ทันที
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  
    try {
      // ✅ เรียก API เบื้องหลัง
      const res = await toggleLike(postid, token)
      setIsLiked(res.liked)
      setLikeCount(res.likes_count)
    } catch (err) {
      console.error('Error toggling like:', err)
      // ❌ rollback ถ้า error
      setIsLiked(prevLiked)
      setLikeCount(prevCount)
    }
  }

  // Comment click (แค่เปิด dialog ถ้ายังไม่ได้ login)
  const handleCommentClick = () => {
    if (!user) setShowDialog(true)
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 items-center ">
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
            <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm me-2 mb-2 dark:bg-gray-800 dark:hover:bg-[hsla(36,4%,44%,1)] dark:focus:ring-gray-700 dark:border-stone-400 px-[40px] py-[12px] border-1 ">
              Go to Homepage
            </button>
          </Link>
        </div>
      )}
      <div>
        {!loading && post && (
          <article className="max-w-auto markdown">
            {post.image && (
              <img
                src={post.image || '/placeholder.svg'}
                alt={post.title}
                className="w-full rounded-lg mb-6 object-cover object-center "
              />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
              <div className="flex flex-col items-start gap-3 mb-3 w-full lg:col-span-3 order-1 lg:order-none">
                <div className="flex flex-row items-center justify-center gap-3 ">
                  {post.category && (
                    <span className="inline-flex items-center rounded-full bg-green-200 text-green-700 px-3 py-1 text-xs font-semibold">
                      {post.category.name || 'Uncategorized'}
                    </span>
                  )}
                  {post.date && (
                    <span className="text-xs text-gray-500 ">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                  {post.title}
                </h1>
                <p className="text-medium text-gray-600 ">{post.description}</p>
                <div>
                  {post.content && (
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  )}
                </div>
                
                <div className="rounded-2xl bg-stone-100 p-5 shadow-sm border border-gray-200 w-full mt-6 block lg:hidden">
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
                    enjoy sharing insights on feline companionship and wellness.
                  </p>
                  <p className="text-sm text-gray-600">
                    When I'm not writing, I spend time volunteering at my local
                    animal shelter, helping cats find loving homes.
                  </p>
                </div>
                {/* Like and Share desktop*/}
                <div className="w-full rounded-3xl bg-stone-100 p-4 mb-5 justify-between items-center shadow-sm mt-4 hidden lg:flex ">
                  <PillNav
                    items={[
                      {
                        label: (
                          <div
                            className={`flex items-center cursor-pointer  `}
                            onClick={handleLikeClick}
                          >
                            <CiFaceSmile />
                            <span style={{ marginLeft: 4 }}>{likeCount}</span>
                          </div>
                        ),
                      },
                    ]}
                    activeHref="/"
                    className="custom-nav "
                    ease="power2.easeOut"
                    baseColor="#f4f3f0"
                    pillColor="#fff"
                    hoveredPillTextColor="#222"
                    pillTextColor="#222"
                  />

                  <div className="flex flex-row gap-10 my-auto items-center  !important">
                    <PillNav
                      items={[
                        {
                          label: (
                            <div className="flex items-center ">
                              <IoCopyOutline />
                              <span style={{ marginLeft: 4 }}>Copy link</span>
                            </div>
                          ),
                          href: '',
                        },
                        { label: <FaFacebook />, href: 'www.facebook.com' },
                        {
                          label: <SlSocialLinkedin />,
                          href: 'www.linkedin.com',
                        },
                        { label: <CiTwitter />, href: 'www.twitter.com' },
                      ]}
                      activeHref="/"
                      className="custom-nav "
                      ease="power2.easeOut"
                      baseColor="#f4f3f0"
                      pillColor="#fff"
                      hoveredPillTextColor="#222"
                      pillTextColor="#222"
                    />
                  </div>
                </div>
                {/* Like and Share mob*/}
                <div className="w-full rounded-3xl bg-stone-100 p-3 flex flex-col items-center gap-3 shadow-sm mt-ex-wrap lg:hidden mb-5">
                  <button
                    className={`flex items-center justify-center w-full border border-gray-300 rounded-full px-6 py-2 bg-white text-black text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 `}
                    onClick={handleLikeClick}
                    
                  >
                    <CiFaceSmile className="text-xl mr-2" />
                    <span>{likeCount}</span>
                  </button>

                  <div className="flex flex-row flex-wrap gap-2 w-full justify-center">
                    <button className="flex items-center justify-center border border-gray-300 rounded-full px-6 py-2 bg-white text-black text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
                      <IoCopyOutline className="text-xl mr-2" />
                      <span>Copy link</span>
                    </button>
                    <button className="flex items-center justify-center border border-gray-300 rounded-full w-12 h-12 bg-white text-black text-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
                      <FaFacebook />
                    </button>
                    <button className="flex items-center justify-center border border-gray-300 rounded-full w-12 h-12 bg-white text-black text-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
                      <SlSocialLinkedin />
                    </button>
                    <button className="flex items-center justify-center border border-gray-300 rounded-full w-12 h-12 bg-white text-black text-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
                      <CiTwitter />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-3 ">
                  <Label htmlFor="message">Comment</Label>
                  <Textarea
                    placeholder={
                      user
                        ? 'What are your thoughts?'
                        : 'Please login to comment'
                    }
                    id="message"
                    onClick={handleCommentClick }
                    disabled={!user}
                    readOnly={!user}
                    className={
                      !user
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-text'
                    }
                  />
                  <button
                    className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm me-2 mb-2 dark:bg-gray-800 dark:hover:bg-[hsla(36,4%,44%,1)] dark:focus:ring-gray-700 dark:border-stone-400 px-[40px] py-[12px] border-1 w-fit lg:ml-auto ${
                      !user
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                    onClick={!user? handleCommentClick : undefined}
                  >
                    Send
                  </button>
                </div>
              </div>
              <div className="mt-8 rounded-2xl bg-stone-100 p-5 shadow-sm border border-gray-200 w-full lg:col-span-1 lg:sticky top-5 self-start hidden lg:block">
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
                  I am a pet enthusiast and freelance writer who specializes in
                  animal behavior and care. With a deep love for cats, I enjoy
                  sharing insights on feline companionship and wellness.
                </p>
                <p className="text-sm text-gray-600">
                  When I'm not writing, I spend time volunteering at my local
                  animal shelter, helping cats find loving homes.
                </p>
              </div>
            </div>
          </article>
        )}
        {showDialog && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
            style={{ pointerEvents: 'auto' }}
            onClick={() => {
              setShowDialog(false)
              
            }}
          >
            <div
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center relative mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowDialog(false)
                 
                }}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 mt-4">
                Create an account to continue
              </h2>
              <button className="w-full bg-gray-900 text-white font-medium py-4 px-6 rounded-full hover:bg-gray-800 transition-colors mb-6">
                <Link to="/register">Create account</Link>
              </button>
              <p className="text-gray-600">
                Already have an account?{' '}
                <button className="text-gray-900 underline hover:no-underline font-medium">
                  <Link to="/login">Log in</Link>
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}