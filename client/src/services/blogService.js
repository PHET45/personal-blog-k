// services/blogService.js
import axios from 'axios'
import { API_URL } from './config'

// ✅ แก้ไข: ใช้ /api เป็น base แล้วเพิ่ม /likes ตอนเรียก
const base = API_URL.replace(/\/$/, "")
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
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : undefined

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
      {}, // empty body
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    
    return res.data
  } catch (err) {
    console.error( {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    })
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
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create post')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating post:', error)
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
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
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
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete post')
    }

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

    const response = await axios.post(`${base}/upload`, {
      image: base64Image,
      originalName: 'post-image.jpg'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return response.data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}