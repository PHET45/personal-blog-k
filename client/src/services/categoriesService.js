//services/categoriesServices.js
import axios from 'axios'
import { API_URL } from './config'

export const getCategories = async () => {
  try {
    const res = await axios.get(`${API_URL}/categories`)
    return res.data // backend ส่ง object blog เดียว
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const getCategoryById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/categories/${id}`)
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const createCategory = async (name) => {
  try {
    const res = await axios.post(`${API_URL}/categories`, { name })
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const updateCategory = async (id, name) => {
  try {
    const res = await axios.put(`${API_URL}/categories/${id}`, { name })
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}

export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API_URL}/categories/${id}`)
    return true
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message)
  }
}
