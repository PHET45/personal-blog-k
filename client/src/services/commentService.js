import axios from 'axios'
import { API_URL } from './config'
import { toast } from 'react-toast'

const API = API_URL.replace(/\/$/, "") + '/api/comments'

// ======================= Get Comments =======================
export const getCommentsByPost = async (postId) => {
  try {
    const res = await axios.get(`${API}/${postId}`)
    toast.success('Comments loaded successfully!')
    return res.data?.data || []
  } catch (err) {
    console.error('Error fetching comments:', err)
    toast.error('Failed to load comments.')
    return []
  }
}

// ======================= Create Comment =======================
export const createComment = async (postId, commentText) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized. Please login first.')
      throw new Error('Unauthorized')
    }

    const res = await axios.post(
      `${API}/`,
      { post_id: postId, comment_text: commentText },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    toast.success('Comment created successfully!')
    return res.data?.data
  } catch (err) {
    console.error('Error creating comment:', err)
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message
    toast.error(`Failed to create comment: ${message}`)
    throw new Error(message)
  }
}

// ======================= Delete Comment =======================
export const deleteComment = async (commentId) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized. Please login first.')
      throw new Error('Unauthorized')
    }

    const res = await axios.delete(`${API}/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.success('Comment deleted successfully!')
    return res.data?.data
  } catch (err) {
    console.error('Error deleting comment:', err)
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message
    toast.error(`Failed to delete comment: ${message}`)
    throw new Error(message)
  }
}
