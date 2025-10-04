// services/blogService.js
import axios from 'axios'
import { API_URL } from './config'

// ✅ แก้ไข: ใช้ /api เป็น base แล้วเพิ่ม /likes ตอนเรียก
const base = API_URL.replace(/\/$/, "")
const API = `${base}/api`

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
    
    console.log('✅ toggleLike success:', res.data)
    return res.data
  } catch (err) {
    console.error('❌ toggleLike error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    })
    throw err
  }
}