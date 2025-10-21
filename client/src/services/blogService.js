// services/blogService.js
import axios from 'axios'
import { API_URL } from './config'
import { toast } from 'react-toast'

// ✅ แก้ไข: ใช้ /api เป็น base แล้วเพิ่ม /likes ตอนเรียก
const base = API_URL.replace(/\/$/, '')
const API = `${base}/api`
// Helper: get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') // หรือชื่อที่คุณเก็บ token
}

export const getPublishedPosts = async (params = {}) => {
  const response = await axios.get(`${base}/posts/public`, { params })
  return response.data
}

export const getPublishedPostById = async (id) => {
  const response = await axios.get(`${API_URL}/posts/public/${id}`)
  return response.data
}
export const getBlogs = async (params = {}) => {
  try {
    const res = await axios.get(`${base}/posts`, { params })
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const getBlogById = async (id) => {
  try {
    const res = await axios.get(`${base}/posts/${id}`)
    return res.data?.data ?? res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const getStatuses = async (params = {}) => {
  try {
    const res = await axios.get(`${base}/statuses`, { params })
    return res.data?.data ?? res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

// ======================= Likes =======================
// ✅ getLikes จะเช็คว่ามี token ไหม
export const getLikes = async (postId, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined

    const res = await axios.get(`${API}/likes/${postId}`, { headers })
    return res.data // guest: { likes_count }, user: { likes_count, liked }
  } catch (err) {
    console.error('getLikes error:', err.response?.data || err.message)
    // ถ้า error ให้ return default แทน throw
    return { likes_count: 0, liked: false }
  }
}

export const toggleLike = async (postId, token) => {
  try {
    if (!token) throw new Error('Unauthorized: No token provided')
    const res = await axios.post(
      `${API}/likes/${postId}/toggle`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    toast.success(
      res.data.liked ? 'You liked this post!' : 'You unliked this post!'
    )
    return res.data
  } catch (err) {
    console.error({
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    })
    toast.error('Failed to toggle like.')
    throw err
  }
}

// POST create new post
export const createPost = async (postData) => {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    })

    // ✅ ตรวจ error code
    if (!response.ok) {
      if (response.status === 413) {
        toast.error('ไฟล์ภาพมีขนาดใหญ่เกินกำหนด (สูงสุด 5MB)')
        throw new Error('Image too large (413)')
      }

      const errorData = await response.json().catch(() => ({}))
      const message =
        errorData.error || errorData.message || 'Failed to create post'
      toast.error(`❌ ไม่สามารถสร้างโพสต์ได้: ${message}`)
      throw new Error(message)
    }

    // ✅ สำเร็จ
    const data = await response.json()
    toast.success('สร้างโพสต์สำเร็จ!')
    return data
  } catch (error) {
    console.error('Error creating post:', error)

    // ✅ handle เผื่อกรณี network ล่ม
    if (error.message.includes('Failed to fetch')) {
      toast.error('🚫 ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
    } else if (!error.message.includes('413')) {
      toast.error('เกิดข้อผิดพลาดขณะสร้างโพสต์')
    }

    throw error
  }
}

// PUT update post
export const updatePost = async (id, postData) => {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update post')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

// DELETE post
export const deletePost = async (id) => {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      const errorData = await response.json()
      toast.error('Failed to delete post.')
      throw new Error(errorData.error || 'Failed to delete post')
    }

    toast.success('Post deleted successfully!')
    return true
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}
// Upload image
export const uploadImage = async (base64Image) => {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await axios.post(
      `${base}/upload`,
      {
        image: base64Image,
        originalName: 'post-image.jpg',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    toast.success('Image uploaded successfully!')
    return response.data
  } catch (error) {
    console.error('Error uploading image:', error)
    toast.error('Failed to upload image.')
    throw error
  }
}

export const askAI = async (question) => {
  try {
    const res = await axios.post(`${API_URL}/api/ai/ask`, { question })
    return res.data
  } catch (error) {
    console.error('Error asking AI:', error.response?.data || error.message)
    throw new Error(error.response?.data?.error || 'AI request failed')
  }
}