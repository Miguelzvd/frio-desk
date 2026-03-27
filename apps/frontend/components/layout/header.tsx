"use client"

import Link from "next/link"
import { Wind } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthStore } from "@/store/auth.store"

export function Header() {
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary">
            <Wind className="size-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-sm tracking-wide">
            FieldReport
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:block">
            {user?.name}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
