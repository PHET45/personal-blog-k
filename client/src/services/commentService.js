import axios from 'axios'
import { API_URL } from './config'

const API = API_URL.replace(/\/$/, "") + '/api/comments'

export const getCommentsByPost = async (postId) => {
  const res = await axios.get(`${API}/${postId}`)
  return res.data?.data || []
}

export const createComment = async (postId, commentText) => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Unauthorized')

  const res = await axios.post(
    `${API}/`,
    { post_id: postId, comment_text: commentText },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data?.data
}


export const deleteComment = async (commentId) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Unauthorized')
  
    const res = await axios.delete(`${API}/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data?.data
  }