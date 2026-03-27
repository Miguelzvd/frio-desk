"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../lib/api";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (user) => {
        document.cookie = `auth-role=${user.role}; path=/; SameSite=Lax`;
        set({ user });
      },
      logout: () => {
        document.cookie = "auth-role=; path=/; max-age=0";
        set({ user: null });
        api.post("/auth/logout").catch(() => {});
      },
      isAdmin: () => get().user?.role === "admin",
    }),
    {
      name: "friodesk-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
