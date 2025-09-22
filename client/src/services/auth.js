import axios from 'axios'
import { API_URL } from './config'

const base = (API_URL || '').replace(/\/$/, '')
const API = `${base}/api`

export const AuthService = {
    login: async (email, password) => {
        const res = await axios.post(`${API}/auth/login`, { email, password });
        if (res.data.token) localStorage.setItem("token", res.data.token);
        return res.data;
      },

  getProfile: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error("No token found");
      const res = await axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data
    } catch (err) {
      const message =
        err.response?.data?.message || err.response?.data?.error || err.message
      throw new Error(message)
    }
  },

  logout: () => localStorage.removeItem('token'),

  register: async ({ name, username, email, password }) => {
    try {
      const res = await axios.post(`${API}/auth/register`, {
        name,
        username,
        email,
        password,
      })
      return res.data
    } catch (err) {
      const message =
        err.response?.data?.message || err.response?.data?.error || err.message
      throw new Error(message)
    }
  },
}
