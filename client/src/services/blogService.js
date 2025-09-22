// import { blogPosts } from '../data/blogPost'

// // params: { page?: number, limit?: number, category?: string, keyword?: string } | string
// export const getBlogs = async (params = {}) => {
//   if (typeof params === 'string') {
//     params = { keyword: params }
//   }

//   const { page = 1, limit = 6, category = '', keyword = '' } = params

//   let filtered = [...blogPosts]
//   if (category) {
//     const cat = String(category).toLowerCase()
//     filtered = filtered.filter((p) => String(p.category).toLowerCase() === cat)
//   }

//   if (keyword) {
//     const q = String(keyword).toLowerCase()
//     filtered = filtered.filter((p) =>
//       [p.title, p.description, p.content]
//         .filter(Boolean)
//         .some((v) => String(v).toLowerCase().includes(q))
//     )
//   }

//   const start = (Number(page) - 1) * Number(limit)
//   const end = start + Number(limit)
//   return filtered.slice(start, end)
// }

// services/blogService.js
import axios from 'axios'
import { API_URL } from './config'

export const getBlogs = async () => {
  try {
    const res = await axios.get(`${API_URL}/posts`)
    return res.data // backend ส่ง object blog เดียว
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const getBlogById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/posts/${id}`)
    return res.data // backend ส่ง object blog เดียว
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}
