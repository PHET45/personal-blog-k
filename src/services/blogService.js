import http from '@/api/http' // <- ใช้ axios instance ที่ config ไว้

export const getBlogs = async (keywords = '') => {
  const res = await http.get(`/blogs?keywords=${encodeURIComponent(keywords)}`)
  return res.data
}

export const getBlogById = async (id) => {
  const res = await http.get(`/blogs/${id}`)
  return res.data
}

export const createBlog = async (data) => {
  const res = await http.post('/blogs', data)
  return res.data
}
