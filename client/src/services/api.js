// /client/src/services/api.js

import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Create an Axios instance with the backend's base URL
const api = axios.create({
  baseURL: "http://localhost:5001/api", // Your backend server
});

// This is an "interceptor" - a function that runs before every single request
api.interceptors.request.use(
  (config) => {
    // Get the token from our Zustand store
    const token = useAuthStore.getState().token;

    if (token) {
      // If the token exists, add it to the 'Authorization' header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  }
);

export default api;
