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
