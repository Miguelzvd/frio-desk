"use client"

import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthStore } from "@/store/auth.store"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <div className="relative flex flex-col gap-5 min-h-full max-w-6xl mx-auto py-8">
      <h2 className="font-heading text-xl font-bold">Perfil</h2>

      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <User className="size-7 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-heading font-semibold truncate">{user?.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
              <p className="mt-1 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Técnico
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="size-4" />
        Sair da conta
      </Button>
    </div>
  )
}
