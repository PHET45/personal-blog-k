// services/blogService.js
import axios from 'axios'
import { API_URL } from './config'

// Normalize possible API shapes to always return an array of blogs

const API = `${API_URL.replace(/\/$/, "")}/likes`;
export const getBlogs = async (params = {}) => {
  try {
    const res = await axios.get(`${API_URL}/posts`, { params })
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const getBlogById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/posts/${id}`)
    return res.data?.data ?? res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const getStatuses = async (params = {}) => {
  try {
    const res = await axios.get(`${API_URL}/statuses`, { params })
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

    const res = await axios.get(`${API}/${postId}`, { headers })
    return res.data // guest: { likes_count }, user: { likes_count, liked }
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message)
  }
}

export const toggleLike = async (postId, token) => {
  if (!token) throw new Error('Unauthorized: No token provided')
  const res = await axios.post(`${API}/${postId}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}