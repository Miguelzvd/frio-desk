import axios from "axios"
import { useAuthStore } from "@/store/auth.store"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !error.config?.url?.includes("/auth/login")
    ) {
      const { logout } = useAuthStore.getState()
      logout()
      const path = window.location.pathname.startsWith("/admin")
        ? "/admin/login"
        : "/login"
      window.location.href = path
    }
    return Promise.reject(error)
  }
)

export default api
