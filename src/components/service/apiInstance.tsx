// src/services/apiInstance.ts

import axios from "axios";

// export const developmentBaseURL = "http://192.168.1.55:3000/api";
// export const developmentBaseURL = "http://192.168.29.218:3000/api";
export const developmentBaseURL = "https://api.opinionkings.com/api";

const apiInstance = axios.create({
  baseURL: developmentBaseURL,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors if needed
if (typeof window !== "undefined") {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token") || "";
      console.log(token, "token====");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export default apiInstance;
