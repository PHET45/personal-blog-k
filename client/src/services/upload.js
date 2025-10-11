//services/upload.js
import axios from "axios";
import { API_URL } from "./config";

const API = API_URL || "http://localhost:3000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const UploadService = {
  // ✅ Upload profile picture
  uploadProfilePic: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.put(`${API}/upload/profile-pic`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  // ✅ เพิ่ม: Update profile info (name, username)
  updateProfile: async (name, username) => {
    const res = await axios.put(
      `${API}/upload/profile`,
      { name, username },
      {
        headers: getAuthHeader(),
      }
    );

    return res.data;
  },

  // ✅ เพิ่ม: Get own profile
  getProfile: async () => {
    const res = await axios.get(`${API}/upload/profile`, {
      headers: getAuthHeader(),
    });

    return res.data;
  },

  // ✅ เพิ่ม: Get other user's profile
  getUserProfile: async (userId) => {
    const res = await axios.get(`${API}/upload/profile/${userId}`, {
      headers: getAuthHeader(),
    });

    return res.data;
  },
};