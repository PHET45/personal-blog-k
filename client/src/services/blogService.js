// services/blogService.js
import axios from 'axios'
import { API_URL } from './config'

// Normalize possible API shapes to always return an array of blogs


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


// Likes
export const getLikes = async (postId) => {
  try {
    const res = await axios.get(`${API_URL}/likes/${postId}`)
    return res.data // { likes_count: number, isLiked: boolean }
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const likePost = async (postId, token) => {
  try {
    const res = await axios.post(`${API_URL}/likes/${postId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const unlikePost = async (postId, token) => {
  try {
    const res = await axios.delete(`${API_URL}/likes/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const toggleLike = async (postId) => {
  const res = await axios.post(`${API_URL}/likes/${postId}`)
  return res.data
}