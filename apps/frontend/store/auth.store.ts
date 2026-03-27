"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  login: (user: AuthUser, accessToken: string) => void
  logout: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      login: (user, accessToken) => {
        document.cookie = `auth-token=${accessToken}; path=/; SameSite=Lax`
        document.cookie = `auth-role=${user.role}; path=/; SameSite=Lax`
        set({ user, accessToken })
      },
      logout: () => {
        document.cookie = "auth-token=; path=/; max-age=0"
        document.cookie = "auth-role=; path=/; max-age=0"
        set({ user: null, accessToken: null })
      },
      isAdmin: () => get().user?.role === "admin",
    }),
    {
      name: "friodesk-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
