// services/blogService.js
import axios from 'axios'
import { API_URL } from './config'

// Normalize possible API shapes to always return an array of blogs
const normalizeListResponse = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

export const getBlogs = async (params = {}) => {
  try {
    const res = await axios.get(`${API_URL}/posts`, { params })
    return normalizeListResponse(res.data)
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
