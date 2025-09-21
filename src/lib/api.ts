import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5000/v1";
export const api = axios.create({
	baseURL: BASE_URL,
	headers: { "Content-Type": "application/json", Accept: "application/json" },
});

api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);
