import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request if available (for client-side only)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // js-cookie only works in browser
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ---------- Auth APIs ----------
export function login(email: string, password: string) {
  return api.post("/auth/login", { email, password });
}

export function authRegister(data: any) {
  return api.post("/auth/register", data);
}

// ---------- Leave APIs ----------
export function createLeave(data: FormData, token?: string) {
  return api.post("/leaves", data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function getMyLeaves(
  page: number = 1,
  limit: number = 10,
  token?: string
) {
  return api.get("/leaves/my", {
    params: { page, limit },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function getAllLeaves(
  page: number = 1,
  limit: number = 10,
  token?: string
) {
  return api.get("/leaves", {
    params: { page, limit },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function updateLeave(id: number, data: any, token?: string) {
  return api.put(`/leaves/${id}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export default api;
