import axios from "axios";
import { setupAuthInterceptor } from "./auth-interceptor";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

setupAuthInterceptor(api);

export default api;
