"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Skeleton } from "@/components/ui/skeleton"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { accessToken } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !accessToken) {
      router.replace("/login")
    }
  }, [mounted, accessToken, router])

  if (!mounted || !accessToken) {
    return (
      <div className="flex min-h-svh flex-col">
        <div className="h-14 border-b border-border bg-background" />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}
