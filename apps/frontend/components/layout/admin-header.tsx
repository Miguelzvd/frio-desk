"use client"

import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/services": "Serviços",
  "/admin/technicians": "Técnicos",
}

export function AdminHeader() {
  const pathname = usePathname()
  const title =
    Object.entries(PAGE_TITLES).find(([key]) =>
      pathname.startsWith(key)
    )?.[1] ?? "Admin"

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="font-heading text-lg font-semibold">{title}</h1>
      <ThemeToggle />
    </header>
  )
}
