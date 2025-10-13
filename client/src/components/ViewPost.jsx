import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
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
import MetaBalls from '@/components/ui/MetaBalls'
import { CommentSection } from '@/components/CommentSection'
import {
  getCommentsByPost,
  createComment,
  deleteComment,
} from '@/services/commentService'
import { toast } from 'react-toast'

export const ViewPost = () => {
  const { postid } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')

  const location = useLocation()
  const shareUrl = window.location.origin + location.pathname

  const getToken = () => localStorage.getItem('token')

  // ✅ Fetch post, user, likes, comments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [postData, profile, likesData, commentData] = await Promise.all([
          getBlogById(postid),
          AuthService.getProfile().catch(() => null),
          getLikes(postid, getToken()).catch(() => ({
            likes_count: 0,
            liked: false,
          })),
          getCommentsByPost(postid).catch(() => []),
        ])
        setPost(postData)
        setUser(profile?.user || null)
        setLikeCount(likesData.likes_count || 0)
        setIsLiked(likesData.liked || false)
        setComments(commentData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [postid])

  useEffect(() => {
    // overflow control for dialog
    document.body.style.overflow = showDialog ? 'hidden' : ''
  }, [showDialog])

  const handleCopyLink = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleLikeClick = useCallback(async () => {
    const token = getToken()
    if (!token) return setShowDialog(true)

    const prevLiked = isLiked
    const prevCount = likeCount
    const newLiked = !isLiked
    setIsLiked(newLiked)
    setLikeCount(newLiked ? likeCount + 1 : likeCount - 1)

    try {
      const res = await toggleLike(postid, token)

      setIsLiked(res.liked)
      setLikeCount(res.likes_count)
    } catch (err) {
      console.error('Error toggling like:', err)

      setIsLiked(prevLiked)
      setLikeCount(prevCount)
    }
  }, [isLiked, likeCount, postid])

  const handleSendComment = async () => {
    if (!user) return setShowDialog(true)
    if (!commentText.trim()) return
    try {
      const newComment = await createComment(postid, commentText)
      setComments((prev) => [newComment, ...prev])
      setCommentText('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteComment = useCallback(async (commentId) => {
    try {
      await deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      console.error(err)
    }
  }, [])

  return (
    <div className="max-w-[1200px] mx-auto p-4 items-center overflow-x-hidden  lg:overflow-x-visible ">
      {loading && (
        <div className="flex flex-col items-center  h-screen gap-6 lg:py-100">
          <MetaBalls
            color="oklch(89.7% 0.196 126.665)"
            cursorBallColor="oklch(89.7% 0.196 126.665)"
            cursorBallSize={4}
            ballCount={30}
            animationSize={60}
            enableMouseInteraction={true}
            enableTransparency={true}
            hoverSmoothness={0.05}
            clumpFactor={2}
            speed={0.3}
          />
        </div>
      )}
      {!loading && !post && (
        <div className="flex flex-col items-center  gap-6 lg:py-100">
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
            <div className="flex items-center justify-center w-full box-border lg:mb-8">
              <div className='lg:max-w-[1200px] w-full lg:aspect-[1200/587] overflow-hidden md:rounded-md md:mt-[60px]'>
              {post.image && (
                <img
                  src={post.image || '/placeholder.svg'}
                  alt={post.title}
                  className="w-full h-full object-cover object-center"
                />
              )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8 top-0">
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

                <div className="rounded-2xl bg-stone-100 p-5 shadow-sm border border-gray-200 w-full mt-6 block lg:hidden sticky top-5 ">
                  <div className="flex items-center gap-3 mb-4 sticky top-5">
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
                        key: 'like-button',
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
                            <div className="flex items-center">
                              <IoCopyOutline />
                              <span style={{ marginLeft: 4 }}>Copy link</span>
                            </div>
                          ),
                          href: '#',
                          onClick: handleCopyLink,
                        },
                        {
                          label: <FaFacebook />,
                          href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        {
                          label: <SlSocialLinkedin />,
                          href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        {
                          label: <CiTwitter />,
                          href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post?.title || '')}`,
                          target: '_blank',
                          rel: 'noopener noreferrer',
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
                    <button 
                      className="flex items-center justify-center border border-gray-300 rounded-full px-6 py-2 bg-white text-black text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      onClick={handleCopyLink}
                    >
                      <IoCopyOutline className="text-xl mr-2" />
                      <span>Copy link</span>
                    </button>
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center border border-gray-300 rounded-full w-12 h-12 bg-white text-black text-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <FaFacebook />
                    </a>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center border border-gray-300 rounded-full w-12 h-12 bg-white text-black text-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <SlSocialLinkedin />
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post?.title || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center border border-gray-300 rounded-full w-12 h-12 bg-white text-black text-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <CiTwitter />
                    </a>
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
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={!user}
                    className={
                      !user ? 'cursor-not-allowed opacity-50' : 'cursor-text'
                    }
                  />

                  <button
                    className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm me-2 mb-2 dark:bg-gray-800 dark:hover:bg-[hsla(36,4%,44%,1)] dark:focus:ring-gray-700 dark:border-stone-400 px-[40px] py-[12px] border-1 w-fit lg:ml-auto ${
                      !user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={handleSendComment}
                  >
                    Send
                  </button>
                </div>
                <CommentSection
                  comments={comments}
                  currentUser={user}
                  onDelete={handleDeleteComment}
                />
              </div>
              <div className="rounded-2xl bg-stone-100 p-5 shadow-sm border border-gray-200 w-full  self-start sticky top-0 hidden lg:block">
                <div className="flex items-center gap-3 mb-4 ">
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