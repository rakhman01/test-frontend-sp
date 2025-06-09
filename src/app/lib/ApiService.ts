import axios from "axios";
import { getToken } from "./JwtService";

// Create an axios instance
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
});

// Add a request interceptor to dynamically set the Authorization header
http.interceptors.request.use(
  (config: any) => {
    if (typeof window !== "undefined") {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error : any) => Promise.reject(error)
);

export default http;