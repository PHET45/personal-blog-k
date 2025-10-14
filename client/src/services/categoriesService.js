//services/categoriesServices.js
import axios from "axios";
import {API_URL} from "./config";

export const getCategories = async () => {
  try {
    const res = await axios.get(`${API_URL}/categories`);
    return res.data; // backend ส่ง object blog เดียว
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};
