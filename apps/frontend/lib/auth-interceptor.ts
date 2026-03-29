import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: AxiosError) => void;
}[] = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = []; 
};

export const setupAuthInterceptor = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => response, 
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || !error.config) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        typeof window !== "undefined" &&
        !originalRequest.url?.includes("/auth/login") &&
        !originalRequest.url?.includes("/auth/register") &&
        !originalRequest.url?.includes("/auth/refresh") &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true; 
        isRefreshing = true; 

        try {
          await api.post("/auth/refresh");
          
          processQueue(null);
          
          return api(originalRequest);
        } catch (refreshError) {
          
          processQueue(refreshError as AxiosError);

          const { logout } = useAuthStore.getState();
          logout();
          const path = window.location.pathname.startsWith("/admin")
            ? "/admin/login"
            : "/login";
          window.location.href = path;

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
